var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');

_.each(['alex', 'ali', 'brandon', 'chad', 'chase', 'christian', 'coley', 'derek', 'daniel', 'evan', 'grant', 'jake', 'james-f', 'james-s', 'james-taylor', 'jonathan', 'jordan', 'luke', 'nick-b', 'nick-s', 'peter', 'robby', 'sal', 'vinny', 'wells', 'will'], function(contestantUrlName) {
    var url = 'http://abc.go.com/shows/the-bachelorette/cast/' + contestantUrlName;

    console.log();
    console.log('Scraping: ' + url);

    request(url, function(err, response, html){
        if (err) {
            console.error(err);
            return;
        }

        var $ = cheerio.load(html);
        var contestantName = $('.m-person-title').text();
        var contestantFileName = contestantName.replace(' ', '').replace('.', '');
        if (!contestantName) {
            console.error('Could not parse contestant name');
            return;
        }
        console.log('Contestant name: ' + contestantName);

        var bioStats = [];
        var bioQuestions = [];

        $('.expandable-section p').each(function(index, element) {
            element = $(element);
            var key = element.find('strong, b').text();
            var endsInSpace = key.slice(-1) === ' ';
            if (endsInSpace) {
                key = key.substring(0, key.length - 1);
            }
            var value = element.text().substring(key.length);
            var startsWithQuestionMark = value.substring(0, 1) === '?';
            if (startsWithQuestionMark) {
                key = key + '?';
                value = value.substring(value.indexOf(' ') + 1);
            } else {
                value = value.substring(1);
            }

            if (!key || key.length < 1) {
                console.error('Could not parse bioStats or bioQuestion key');
                return;
            }

            if (!value || value.length < 1) {
                console.error('Could not parse bioStats or bioQuestion value');
                return;
            }

            key = key
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace('…', '...');
            value = value
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace('…', '...');

            console.log();
            if (index < 4) {
                bioStats.push({ name : key, value : value });
                console.log('BioStat:');
            } else {
                bioQuestions.push({ question : key, answer : value });
                console.log('BioQuestion:');
            }
            console.log(key);
            console.log(value);
        });

        if (bioStats.length < 1) {
            console.error('Could not parse contestant bioStats');
            return;
        }

        if (bioQuestions.length < 1) {
            console.error('Could not parse contestant bioQuestions');
            return;
        }

        if (contestantName === 'Chase') {
            bioStats[3].name = "Tattoos:";
            bioStats[3].value = "Yes. Lion on my left ribs.";
        }

        if (contestantName === 'Ali') {
            bioQuestions[0].question = "Would you describe yourself as \"the party-starter,\" \"the wingman\" or \"the laid back one\"?";
        }

        if (contestantName === 'Brandon') {
            bioQuestions[0].question = "Would you describe yourself as \"the party-starter,\" \"the wingman\" or \"the laid back one\"?";
        }

        if (contestantName === 'Evan') {
            bioQuestions[0].question = "Would you describe yourself as \"the party-starter,\" \"the wingman\" or \"the laid back one\"?";
            bioQuestions[0].answer = "I start out laid back, but then end up getting the party started...";
        }

        if (contestantName === 'Jake') {
            bioQuestions[0].question = "Would you describe yourself as \"the party-starter,\" \"the wingman\" or \"the laid back one\"?";
            bioQuestions[0].answer = "A combination of all three. I'm not afraid to get my feet wet, but I also know when to keep quiet.";
        }


        if (contestantName === 'Coley') {
            bioQuestions[0].question = "Would you describe yourself as \"the party-starter,\" \"the wingman\" or \"the laid back one\"?";
            bioQuestions[0].answer = "Depends on the situation. More the party-starter, but can also be considered laid back.";
        }

        if (contestantName === 'Derek') {
            bioQuestions[7].question = "What is the most outrageous thing you have ever done?";
        }

        if (contestantName === 'Will') {
            bioStats[2].value = "6' 2 1/2\"";
        }

        try { fs.mkdirSync('build'); } catch (err) {}
        try { fs.mkdirSync('build/contestantData'); } catch (err) {}

        var filePath = 'build/contestantData/' + contestantFileName + '.json';
        fs.writeFileSync(filePath, JSON.stringify({
            name : contestantName,
            bioStats : bioStats,
            bioQuestions : bioQuestions
        }, null, 2));

        console.log();
        console.log('Wrote data to: ' + filePath);
    });

});