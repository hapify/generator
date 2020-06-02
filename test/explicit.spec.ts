import { expect } from '@hapi/code';
import 'mocha';
import { Generator } from '../src';
import { Model, Template, Field, Accesses, StringVariations, ExplicitDeepModelFields, ExplicitDeepModelProperties } from '../src/interfaces';

const getModels = (fieldsOverrides: Partial<Field>[] = [{}], accessesOverrides: Partial<Accesses> = {}): Model[] => {
	const names = ['name', 'price', 'created at', 'forbidden', 'visible', 'closed at', 'description'];
	const fields: Field[] = [];

	for (let i = 0; i < fieldsOverrides.length; i++) {
		fields.push(
			Object.assign(
				{
					name: names[i % names.length],
					type: 'string',
					subtype: null,
					reference: null,
					primary: false,
					unique: false,
					label: false,
					nullable: false,
					multiple: false,
					embedded: false,
					searchable: false,
					sortable: false,
					hidden: false,
					internal: false,
					restricted: false,
					ownership: false,
				},
				fieldsOverrides[i]
			)
		);
	}
	return [
		{
			id: `0cf80d75-abcd-f8c7-41f6-ed41c6425aa1`,
			name: 'User profile',
			fields,
			accesses: Object.assign(
				{
					create: 'guest',
					read: 'guest',
					update: 'guest',
					remove: 'guest',
					search: 'guest',
					count: 'guest',
				},
				accessesOverrides
			),
		},
	];
};
const getTemplates = (content: string = ''): Template[] => {
	return [
		{
			path: 'index.js',
			engine: 'js',
			input: 'one',
			content,
		},
	];
};

describe('model names', () => {
	const variations: { name: keyof StringVariations; value: string }[] = [
		{ name: 'raw', value: 'User profile' },
		{ name: 'kebab', value: 'user-profile' },
		{ name: 'snake', value: 'user_profile' },
		{ name: 'header', value: 'User-Profile' },
		{ name: 'constant', value: 'USER_PROFILE' },
		{ name: 'big', value: 'USER-PROFILE' },
		{ name: 'capital', value: 'User Profile' },
		{ name: 'lower', value: 'user profile' },
		{ name: 'upper', value: 'USER PROFILE' },
		{ name: 'compact', value: 'userprofile' },
		{ name: 'pascal', value: 'UserProfile' },
		{ name: 'camel', value: 'userProfile' },
	];

	for (const variation of variations) {
		it(variation.name, async () => {
			const templates = getTemplates(`return model.names.${variation.name};`);
			const response1 = await Generator.run(templates, getModels());
			expect(response1.length).to.equal(1);
			expect(response1[0].content).to.equal(variation.value);
		});
	}

	it('model.name', async () => {
		const templates = getTemplates(`return model.name;`);
		const response1 = await Generator.run(templates, getModels());
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('User profile');
	});
});

describe('field names', () => {
	const variations: { name: keyof StringVariations; value: string }[] = [
		{ name: 'raw', value: 'Created at' },
		{ name: 'kebab', value: 'created-at' },
		{ name: 'snake', value: 'created_at' },
		{ name: 'header', value: 'Created-At' },
		{ name: 'constant', value: 'CREATED_AT' },
		{ name: 'big', value: 'CREATED-AT' },
		{ name: 'capital', value: 'Created At' },
		{ name: 'lower', value: 'created at' },
		{ name: 'upper', value: 'CREATED AT' },
		{ name: 'compact', value: 'createdat' },
		{ name: 'pascal', value: 'CreatedAt' },
		{ name: 'camel', value: 'createdAt' },
	];

	for (const variation of variations) {
		it(variation.name, async () => {
			const templates = getTemplates(`return model.fields.list[0].names.${variation.name};`);
			const response1 = await Generator.run(templates, getModels([{ name: 'Created at' }]));
			expect(response1.length).to.equal(1);
			expect(response1[0].content).to.equal(variation.value);
		});
	}
});

describe('fields list', () => {
	const types: { name: keyof ExplicitDeepModelFields; short: keyof ExplicitDeepModelFields }[] = [
		{ name: 'primary', short: 'pr' },
		{ name: 'unique', short: 'un' },
		{ name: 'label', short: 'lb' },
		{ name: 'nullable', short: 'nu' },
		{ name: 'multiple', short: 'ml' },
		{ name: 'embedded', short: 'em' },
		{ name: 'searchable', short: 'se' },
		{ name: 'sortable', short: 'so' },
		{ name: 'hidden', short: 'hd' },
		{ name: 'internal', short: 'in' },
		{ name: 'restricted', short: 'rs' },
		{ name: 'ownership', short: 'os' },
	];

	for (const type of types) {
		it(type.name, async () => {
			const templates =
				type.name === 'primary'
					? getTemplates(`return typeof model.fields.${type.name} !== 'undefined' ? 'yes': 'no';`)
					: getTemplates(`return model.fields.${type.name}.length > 0 ? 'yes': 'no';`);
			const response1 = await Generator.run(templates, getModels([{ [type.name]: true }]));
			expect(response1.length).to.equal(1);
			expect(response1[0].content).to.equal('yes');

			const response2 = await Generator.run(templates, getModels());
			expect(response2.length).to.equal(1);
			expect(response2[0].content).to.equal('no');
		});
		it(type.short, async () => {
			const templates =
				type.name === 'primary'
					? getTemplates(`return typeof model.fields.${type.short} !== 'undefined' ? 'yes': 'no';`)
					: getTemplates(`return model.fields.${type.short}.length > 0 ? 'yes': 'no';`);
			const response1 = await Generator.run(templates, getModels([{ [type.name]: true }]));
			expect(response1.length).to.equal(1);
			expect(response1[0].content).to.equal('yes');

			const response2 = await Generator.run(templates, getModels());
			expect(response2.length).to.equal(1);
			expect(response2[0].content).to.equal('no');
		});
	}

	it('searchableLabel', async () => {
		const templates = getTemplates(`return model.fields.searchableLabel.length > 0 ? 'yes': 'no';`);
		const response1 = await Generator.run(templates, getModels([{ label: true, searchable: true }]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels());
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});
	it('sl', async () => {
		const templates = getTemplates(`return model.fields.sl.length > 0 ? 'yes': 'no';`);
		const response1 = await Generator.run(templates, getModels([{ label: true, searchable: true }]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels());
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});
});

describe('fields filter', () => {
	it('empty', async () => {
		const templates = getTemplates(`return model.fields.filter().length + '';`);
		const response1 = await Generator.run(templates, getModels([{}, {}, {}]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('3');
	});
	it('active', async () => {
		const templates = getTemplates(`return model.fields.filter(f => f.hidden).length + '';`);
		const response1 = await Generator.run(templates, getModels([{}, { hidden: true }, {}]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('1');
	});
});

describe('model properties', () => {
	it('fieldsCount', async () => {
		const templates = getTemplates(`return model.properties.fieldsCount + '';`);
		const response1 = await Generator.run(templates, getModels([{}, {}, {}]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('3');
	});

	const types: { name: keyof ExplicitDeepModelFields; prop: keyof ExplicitDeepModelProperties }[] = [
		{ name: 'primary', prop: 'hasPrimary' },
		{ name: 'unique', prop: 'hasUnique' },
		{ name: 'label', prop: 'hasLabel' },
		{ name: 'nullable', prop: 'hasNullable' },
		{ name: 'multiple', prop: 'hasMultiple' },
		{ name: 'embedded', prop: 'hasEmbedded' },
		{ name: 'searchable', prop: 'hasSearchable' },
		{ name: 'sortable', prop: 'hasSortable' },
		{ name: 'hidden', prop: 'hasHidden' },
		{ name: 'internal', prop: 'hasInternal' },
		{ name: 'restricted', prop: 'hasRestricted' },
		{ name: 'ownership', prop: 'hasOwnership' },
	];

	for (const type of types) {
		it(type.prop, async () => {
			const templates = getTemplates(`return model.properties.${type.prop} ? 'yes': 'no';`);
			const response1 = await Generator.run(templates, getModels([{ [type.name]: true }]));
			expect(response1.length).to.equal(1);
			expect(response1[0].content).to.equal('yes');

			const response2 = await Generator.run(templates, getModels());
			expect(response2.length).to.equal(1);
			expect(response2[0].content).to.equal('no');
		});
	}

	it('searchableLabel', async () => {
		const templates = getTemplates(`return model.properties.hasSearchableLabel ? 'yes': 'no';`);
		const response1 = await Generator.run(templates, getModels([{ label: true, searchable: true }]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels());
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});

	it('isGeolocated', async () => {
		const templates = getTemplates(`return model.properties.isGeolocated ? 'yes': 'no';`);
		const response1 = await Generator.run(
			templates,
			getModels([
				{ type: 'number', subtype: 'latitude' },
				{ type: 'number', subtype: 'longitude' },
			])
		);
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels([{ type: 'number', subtype: 'latitude' }]));
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});

	it('isGeoSearchable', async () => {
		const templates = getTemplates(`return model.properties.isGeoSearchable ? 'yes': 'no';`);
		const response1 = await Generator.run(
			templates,
			getModels([
				{ type: 'number', subtype: 'latitude', searchable: true },
				{ type: 'number', subtype: 'longitude', searchable: true },
			])
		);
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(
			templates,
			getModels([
				{ type: 'number', subtype: 'latitude' },
				{ type: 'number', subtype: 'longitude', searchable: true },
			])
		);
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});

	it('mainlyHidden', async () => {
		const templates = getTemplates(`return model.properties.mainlyHidden ? 'yes': 'no';`);
		const response1 = await Generator.run(templates, getModels([{ hidden: true }, { hidden: true }, {}]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels([{ hidden: true }, {}, {}]));
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});

	it('mainlyInternal', async () => {
		const templates = getTemplates(`return model.properties.mainlyInternal ? 'yes': 'no';`);
		const response1 = await Generator.run(templates, getModels([{ internal: true }, { internal: true }, {}]));
		expect(response1.length).to.equal(1);
		expect(response1[0].content).to.equal('yes');

		const response2 = await Generator.run(templates, getModels([{ internal: true }, {}, {}]));
		expect(response2.length).to.equal(1);
		expect(response2[0].content).to.equal('no');
	});
});
