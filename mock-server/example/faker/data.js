const faker = require("faker");

class FakerData {
	constructor(locale) {
		this._faker = faker;
		this._faker.locale = locale || "zh_CN";
	}

	getData() {
		const address = {
			zipCode: this._faker.address.zipCode(),
			city: this._faker.address.city(),
			cityPrefix: this._faker.address.cityPrefix(),
			citySuffix: this._faker.address.citySuffix(),
			streetName: this._faker.address.streetName(),
			streetAddress: this._faker.address.streetAddress(),
			streetSuffix: this._faker.address.streetSuffix(),
			streetPrefix: this._faker.address.streetPrefix(),
			secondaryAddress: this._faker.address.secondaryAddress(),
			county: this._faker.address.county(),
			country: this._faker.address.country(),
			countryCode: this._faker.address.countryCode(),
			state: this._faker.address.state(),
			stateAbbr: this._faker.address.stateAbbr(),
			latitude: this._faker.address.latitude(),
			longitude: this._faker.address.longitude()
		};
		const commerce = {
			color: this._faker.commerce.color(),
			department: this._faker.commerce.department(),
			productName: this._faker.commerce.productName(),
			price: this._faker.commerce.price(),
			productAdjective: this._faker.commerce.productAdjective(),
			productMaterial: this._faker.commerce.productMaterial(),
			product: this._faker.commerce.product()
		};
		const company = {
			suffixes: this._faker.company.suffixes(),
			companyName: this._faker.company.companyName(),
			companySuffix: this._faker.company.companySuffix(),
			catchPhrase: this._faker.company.catchPhrase(),
			bs: this._faker.company.bs(),
			catchPhraseAdjective: this._faker.company.catchPhraseAdjective(),
			catchPhraseDescriptor: this._faker.company.catchPhraseDescriptor(),
			catchPhraseNoun: this._faker.company.catchPhraseNoun(),
			bsAdjective: this._faker.company.bsAdjective(),
			bsBuzz: this._faker.company.bsBuzz(),
			bsNoun: this._faker.company.bsNoun()
		};
		const database = {
			column: this._faker.database.column(),
			type: this._faker.database.type(),
			collation: this._faker.database.collation(),
			engine: this._faker.database.engine()
		};
		const date = {
			past: this._faker.date.past(),
			future: this._faker.date.future(),
			between: this._faker.date.between(),
			recent: this._faker.date.recent(),
			// soon: this._faker.date.soon(),
			month: this._faker.date.month(),
			weekday: this._faker.date.weekday()
		};
		const finance = {
			account: this._faker.finance.account(),
			accountName: this._faker.finance.accountName(),
			mask: this._faker.finance.mask(),
			amount: this._faker.finance.amount(),
			transactionType: this._faker.finance.transactionType(),
			currencyCode: this._faker.finance.currencyCode(),
			currencyName: this._faker.finance.currencyName(),
			currencySymbol: this._faker.finance.currencySymbol(),
			bitcoinAddress: this._faker.finance.bitcoinAddress(),
			// ethereumAddress: this._faker.finance.ethereumAddress(),
			iban: this._faker.finance.iban(),
			bic: this._faker.finance.bic(),
		};
		const hacker = {
			abbreviation: this._faker.hacker.abbreviation(),
			adjective: this._faker.hacker.adjective(),
			noun: this._faker.hacker.noun(),
			verb: this._faker.hacker.verb(),
			ingverb: this._faker.hacker.ingverb(),
			phrase: this._faker.hacker.phrase(),
		};
		const helpers = {
			randomize: this._faker.helpers.randomize(),
			slugify: this._faker.helpers.slugify(),
			replaceSymbolWithNumber: this._faker.helpers.replaceSymbolWithNumber(),
			replaceSymbols: this._faker.helpers.replaceSymbols(),
			shuffle: this._faker.helpers.shuffle(),
			mustache: this._faker.helpers.mustache(),
			createCard: this._faker.helpers.createCard(),
			contextualCard: this._faker.helpers.contextualCard(),
			userCard: this._faker.helpers.userCard(),
			createTransaction: this._faker.helpers.createTransaction(),
		};
		const image = {
			image: this._faker.image.image(),
			avatar: this._faker.image.avatar(),
			imageUrl: this._faker.image.imageUrl(),
			abstract: this._faker.image.abstract(),
			animals: this._faker.image.animals(),
			business: this._faker.image.business(),
			cats: this._faker.image.cats(),
			city: this._faker.image.city(),
			food: this._faker.image.food(),
			nightlife: this._faker.image.nightlife(),
			fashion: this._faker.image.fashion(),
			people: this._faker.image.people(),
			nature: this._faker.image.nature(),
			sports: this._faker.image.sports(),
			technics: this._faker.image.technics(),
			transport: this._faker.image.transport(),
			dataUri: this._faker.image.dataUri(),
		};
		const internet = {
			avatar: this._faker.internet.avatar(),
			email: this._faker.internet.email(),
			exampleEmail: this._faker.internet.exampleEmail(),
			userName: this._faker.internet.userName(),
			protocol: this._faker.internet.protocol(),
			url: this._faker.internet.url(),
			domainName: this._faker.internet.domainName(),
			domainSuffix: this._faker.internet.domainSuffix(),
			domainWord: this._faker.internet.domainWord(),
			ip: this._faker.internet.ip(),
			ipv6: this._faker.internet.ipv6(),
			userAgent: this._faker.internet.userAgent(),
			color: this._faker.internet.color(),
			mac: this._faker.internet.mac(),
			password: this._faker.internet.password(),
		};
		const lorem = {
			word: this._faker.lorem.word(),
			words: this._faker.lorem.words(),
			sentence: this._faker.lorem.sentence(),
			slug: this._faker.lorem.slug(),
			sentences: this._faker.lorem.sentences(),
			paragraph: this._faker.lorem.paragraph(),
			paragraphs: this._faker.lorem.paragraphs(),
			text: this._faker.lorem.text(),
			lines: this._faker.lorem.lines(),
		};
		const name = {
			firstName: this._faker.name.firstName(),
			lastName: this._faker.name.lastName(),
			findName: this._faker.name.findName(),
			jobTitle: this._faker.name.jobTitle(),
			prefix: this._faker.name.prefix(),
			suffix: this._faker.name.suffix(),
			title: this._faker.name.title(),
			jobDescriptor: this._faker.name.jobDescriptor(),
			jobArea: this._faker.name.jobArea(),
			jobType: this._faker.name.jobType(),
		};
		const phone = {
			phoneNumber: this._faker.phone.phoneNumber(),
			phoneNumberFormat: this._faker.phone.phoneNumberFormat(),
			phoneFormats: this._faker.phone.phoneFormats(),
		};
		const random = {
			number: this._faker.random.number(),
			// float: this._faker.random.float(),
			arrayElement: this._faker.random.arrayElement(),
			objectElement: this._faker.random.objectElement(),
			uuid: this._faker.random.uuid(),
			boolean: this._faker.random.boolean(),
			word: this._faker.random.word(),
			words: this._faker.random.words(),
			image: this._faker.random.image(),
			locale: this._faker.random.locale(),
			alphaNumeric: this._faker.random.alphaNumeric(),
			// hexaDecimal: this._faker.random.hexaDecimal(),
		};
		const system = {
			fileName: this._faker.system.fileName(),
			commonFileName: this._faker.system.commonFileName(),
			mimeType: this._faker.system.mimeType(),
			commonFileType: this._faker.system.commonFileType(),
			commonFileExt: this._faker.system.commonFileExt(),
			fileType: this._faker.system.fileType(),
			fileExt: this._faker.system.fileExt(),
			directoryPath: this._faker.system.directoryPath(),
			filePath: this._faker.system.filePath(),
			semver: this._faker.system.semver(),
		};

		return Object.assign(
			{},
			this._rename(address, "address"),
			this._rename(commerce, "commerce"),
			this._rename(company, "company"),
			this._rename(database, "database"),
			this._rename(date, "date"),
			this._rename(finance, "finance"),
			this._rename(hacker, "hacker"),
			this._rename(helpers, "helpers"),
			this._rename(image, "image"),
			this._rename(internet, "internet"),
			this._rename(lorem, "lorem"),
			this._rename(name, "name"),
			this._rename(phone, "phone"),
			this._rename(random, "random"),
			this._rename(system, "system"),
		);
	}

	_rename(obj, prefix) {
		Object.keys(obj).forEach(key => {
			obj[prefix + "_" + key] = obj[key];
			delete obj[key];
		});
		return obj;
	}
}

module.exports = FakerData
