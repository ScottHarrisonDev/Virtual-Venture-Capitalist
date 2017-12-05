var settings = {
	'gridSpaces': 9,
	'refreshTime': 500
}
var companyNames = [
	'Youber',
	'AirBook',
	'Face B&B',
	'NetCoin',
	'Chainflix',
	'Yawoo!',
	'CryptoCademy',
	'BitBook',
	'Flitter',
	'GWhale',
	'Deliverwho',
	'Why-Scanner',
	'BlockTube',
	'MeTube'
];
var levels = [
	{
		'name': 'Boonies',
		'location': 'rural',
		'prices': {
			'min': 50,
			'max': 10000,
			'steps': 50
		}
	},
	{
		'name': 'Silicon Valley',
		'location': 'city',
		'prices': {
			'min': 1000000,
			'max': 1000000000,
			'steps': 1000000
		}
	}
];
var player = {
	'cash': 5000,
	'level': 1,
	'companies': []
}
var companies = [];

function setup() {
	document.querySelector('.grid-wrapper').addEventListener('click', function(event) {
	    var clickedEl = event.target;
	    if(clickedEl.tagName === 'BUTTON') {
	    	txToggle(clickedEl.dataset.companyId);
	    }
	});
}

function updateCash() {
	document.querySelector('.cash').innerHTML = player.cash;
}

function generateCompany() {
	var value = randNum(levels[getLevel()].prices.min, levels[getLevel()].prices.max, levels[getLevel()].prices.steps);
	var company = {
		'value': value,
		'name': companyNames[randNum(0, companyNames.length-1)],
		'maxValue': randNum(value, levels[getLevel()].prices.max, levels[getLevel()].prices.steps),
		'direction': Math.random() < 0.5 ? 'up' : 'down',
		'volatility': Math.random() < 0.3 ? 0.3 : 0.7
	}
	companies.push(company);

	var gridHTML = '<div class="grid-item" data-company-id="' + (companies.length-1) + '">';
	gridHTML += '<div class="grid-item-inner">';
    gridHTML += '<span class="company-value">' + company.value + '</span>';
	gridHTML += '<p class="company-name">' + company.name + '</p>';
    gridHTML += '<button class="tx-toggle" data-company-id="' + (companies.length-1) + '">Buy</button>';
    gridHTML += '</div>';
    gridHTML += '</div>';
    document.querySelector('.grid-wrapper').innerHTML += gridHTML;
}

function refreshCompanies() {
	for (var i = 0; i < companies.length; i++) {
		if (companies[i].value >= companies[i].maxValue) {
			companies[i].direction = 'down';
			companies[i].volatility = 0.1;
		}
		if (companies[i].value <= 0) {
			companies[i].direction = 'up'
		}
		if (companies[i].direction === 'up') {
			companies[i].value += levels[getLevel()].prices.steps;
		} else {
			companies[i].value -= levels[getLevel()].prices.steps;
		}
		// Randomize direction  
		companies[i].direction = Math.random() < companies[i].volatility ? 'up' : 'down';
		document.querySelector('.grid-item[data-company-id="' + i + '"] .company-value').innerHTML = companies[i].value;
	}
}

function txToggle(companyId) {
	if (player.companies.indexOf(companyId) != -1) {
		sellCompany(companyId);
	} else {
		buyCompany(companyId);
	}
}

function buyCompany(companyId) {
	var company = companies[companyId];
	if (company.value <= player.cash) {
		player.companies.push(companyId);
		player.cash -= company.value;
		document.querySelector('.grid-item[data-company-id="' + companyId + '"]').classList.add('owned');
		document.querySelector('.grid-item[data-company-id="' + companyId + '"] .tx-toggle').innerHTML = 'Sell';
	}
	updateCash();
}

function sellCompany(companyId) {
	var company = companies[companyId];

	var playerIndex = player.companies.indexOf(companyId);
	if (playerIndex > -1) {
		player.companies.splice(playerIndex, 1);
	}
	document.querySelector('.grid-item[data-company-id="' + companyId + '"]').classList.remove('owned');
	document.querySelector('.grid-item[data-company-id="' + companyId + '"] .tx-toggle').innerHTML = 'Buy';
	player.cash += company.value;
	updateCash();
}

// HELPERS

function getLevel() {
	return player.level - 1;
}

function randNum(min,max,steps) {
	steps = typeof steps !== 'undefined' ? steps : 1;
	if (steps > 1) {
    	return Math.round(Math.floor(Math.random()*(max-min+1)+min) / steps) * steps;
	} else {
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}


setup();
updateCash();
for (var i = 0; i < 9; i++) {
	generateCompany();
}
setInterval(function(){
	refreshCompanies();
}, settings.refreshTime);