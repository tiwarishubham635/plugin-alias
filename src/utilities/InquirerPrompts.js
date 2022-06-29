
const Trie = require('./TrieClass/Trie');
var distance = require('jaro-winkler');
const inquirer = require('inquirer');
const num_of_suggestions = 3

class InquirerPrompts {
    constructor(context, exit_message, userAlias, db) {
        this.ctx = context;
        this.userAlias = userAlias;
        this.exit_message = exit_message;
        this.db = db;

    }


    async findSuggestions() {
        const commandIDs = Object.keys(this.db)


        if (commandIDs.length === 0)
            return this.exit_message;


        const suggestions = this.constructSuggestions(this.userAlias);

        if (suggestions.length === 0) {
            return this.exit_message;
        }

        suggestions.push(this.exit_message);
        let result = this.exit_message;
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'promptAnswer',
                    message: 'Did you mean?',
                    choices: suggestions,
                    default: this.exit_message
                },
            ])
            .then(answers => {
                result = answers.promptAnswer;

            });

        return result;
    }

    constructSuggestions(userAlias) {

        const commandIDs = Object.keys(this.db)

        // let trie = new Trie();
        // change in comment

        // for (let alias in this.db) {
        //     trie.insert(alias);
        // }
        // const suggestions = trie.find(userAlias);
        // return suggestions

        commandIDs.sort(function distance_comparator(cmd1, cmd2) {

            const dist_cmd1 = distance(userAlias, cmd1);
            const dist_cmd2 = distance(userAlias, cmd2);
            if (dist_cmd1 > dist_cmd2)
                return -1;
            else if (dist_cmd1 < dist_cmd2)
                return 1;
            else
            {
                if (cmd1.length < cmd2.length)
                    return -1;
                else if (cmd1.length > cmd2.length)
                    return 1;
                else
                    return 0;
            }
        });


        const suggestions = commandIDs.slice(0, num_of_suggestions);

        return suggestions;
    }

}
module.exports = InquirerPrompts;