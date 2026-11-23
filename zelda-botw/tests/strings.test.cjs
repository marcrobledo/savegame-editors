// Run with: node --test zelda-botw/tests/strings.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');

function openEditor(buffer, littleEndian = true) {
	const context = vm.createContext({
		TextEncoder, TextDecoder,
		saveAs() {},
		navigator: {userAgent: ''},
		window: {addEventListener() {}},
		document: {
			createElement: () => ({style: {}, addEventListener() {}}),
			addEventListener() {}
		}
	});
	for (const file of ['savegame-editor.js', 'zelda-botw/zelda-botw.js'])
		vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename: file});
	const file = new context.MarcFile(buffer.length);
	file.writeBytes(0, buffer);
	file.littleEndian = littleEndian;
	context.tempFile = file;
	return {editor: context.SavegameEditor, file};
}

// Assemble a field independently of the editor's string writer.
function putString(buffer, offset, text, chunks = 16) {
	const bytes = Buffer.alloc(chunks * 4);
	bytes.write(text, 'utf8');
	for (let i = 0; i < chunks; i++)
		bytes.copy(buffer, offset + i * 8, i * 4, i * 4 + 4);
}

function payload(buffer, offset, chunks = 16) {
	return Buffer.concat(Array.from({length: chunks}, (_, i) =>
		buffer.subarray(offset + i * 8, offset + i * 8 + 4)));
}

for (const littleEndian of [true, false]) {
	const platform = littleEndian ? 'Switch' : 'Wii U';

	test(`${platform}: reads UTF-8 names across four-byte records`, () => {
		for (const name of ['伊波娜', '普伊尼', 'あおい말', '马A🐎é', 'Epona']) {
			const buffer = Buffer.alloc(256, 0xa5);
			putString(buffer, 4, name);
			const {editor} = openEditor(buffer, littleEndian);
			assert.equal(editor._readString64(4), name);
		}
	});

	test(`${platform}: horse rename writes UTF-8 and preserves hashes and adjacent slots`, () => {
		const original = Buffer.alloc(5 * 128 + 8, 0xa5);
		putString(original, 4 + 2 * 128, 'Catherine');
		const {editor, file} = openEditor(original, littleEndian);
		editor.Offsets = {HORSE_NAMES: 4};
		editor.setHorseName(2, '伊波娜🐎');
		const result = Buffer.from(file._u8array);
		const expected = Buffer.alloc(64);
		expected.write('伊波娜🐎', 'utf8');
		assert.deepEqual(payload(result, 4 + 2 * 128), expected);
		for (let i = 0; i < result.length; i++) {
			const relative = i - (4 + 2 * 128);
			if (relative < 0 || relative >= 128 || relative % 8 >= 4)
				assert.equal(result[i], original[i], `unrelated byte ${i} changed`);
		}
		const reopened = openEditor(result, littleEndian);
		assert.equal(reopened.editor._readString64(4, 2), '伊波娜🐎');
	});
}

test('a shorter name clears the previous UTF-8 text and stops at the first null', () => {
	const buffer = Buffer.alloc(132, 0xa5);
	putString(buffer, 4, 'Catherine普伊尼');
	const {editor, file} = openEditor(buffer);
	editor._writeString64(4, '马');
	const expected = Buffer.alloc(64);
	expected.write('马', 'utf8');
	assert.deepEqual(payload(Buffer.from(file._u8array), 4), expected);
	// Stale bytes after a null in another record must not become part of the name.
	file.writeU8(12, 0x41);
	assert.equal(editor._readString64(4), '马');
});

test('overlong text is null-terminated without splitting UTF-8 characters', () => {
	for (const [name, expected] of [
		['A'.repeat(80), 'A'.repeat(63)],
		['A'.repeat(62) + '马', 'A'.repeat(62)],
		['A'.repeat(61) + '🐎', 'A'.repeat(61)],
		['马'.repeat(22), '马'.repeat(21)]
	]) {
		const {editor, file} = openEditor(Buffer.alloc(132, 0xa5));
		editor._writeString64(4, name);
		const bytes = payload(Buffer.from(file._u8array), 4);
		const end = bytes.indexOf(0);
		assert.ok(end >= 0);
		assert.equal(new TextDecoder('utf-8', {fatal: true}).decode(bytes.subarray(0, end)), expected);
		assert.equal(editor._readString64(4), expected);
	}
});

test('ASCII identifiers and other string field sizes keep their byte layout', () => {
	for (const [text, chunks] of [['MainField', 8], ['Weapon_Sword_070', 16], ['GameRomHorseEpona', 64]]) {
		const buffer = Buffer.alloc(chunks * 8 + 8, 0xa5);
		const expected = Buffer.from(buffer);
		putString(expected, 4, text, chunks);
		const {editor, file} = openEditor(buffer);
		if (chunks === 8)
			editor._writeString(4, text);
		else if (chunks === 16)
			editor._writeString64(4, text);
		else
			editor._writeString256(4, text);
		assert.deepEqual(Buffer.from(file._u8array), expected);
		assert.equal(editor._readString(4, chunks), text);
	}
});

test('bundled Wii U save: ASCII horse names round-trip without changing any bytes', () => {
	const original = fs.readFileSync(path.join(root, 'zelda-botw/game_data.sav'));
	const {editor, file} = openEditor(original, false);
	editor._getOffsets();
	assert.equal(typeof editor.Offsets.HORSE_NAMES, 'number');
	for (let i = 0; i < 5; i++) {
		const name = editor._readString64(editor.Offsets.HORSE_NAMES, i);
		editor.setHorseName(i, name);
	}
	assert.deepEqual(Buffer.from(file._u8array), original);
	editor.setHorseName(0, '伊波娜');
	const reopened = openEditor(Buffer.from(file._u8array), false);
	reopened.editor._getOffsets();
	assert.equal(reopened.editor._readString64(reopened.editor.Offsets.HORSE_NAMES), '伊波娜');
});
