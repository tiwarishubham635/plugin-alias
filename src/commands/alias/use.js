const AliasBaseCommand = require('../../utilities/AliasBaseCommand');
const FileUtil = require('../../utilities/FileUtility.js');
const CommandUtil = require('../../utilities/CommandUtility.js');
const FilesystemStorage = require('../../utilities/FileSnapshot/FilesystemStorage');
const InquirerPrompts = require('../../utilities/InquirerPrompts')

class Use extends AliasBaseCommand {

  constructor(argv, config) {
    super(argv, config);
  }

  async run() {
    await super.run();

    if (this.argv.length <= 0) {
      console.log('Please insert an alias argument');
      return;
    }


    const supposedAlias = this.argv.shift();
    const aliasFilePath = new FileUtil(this).getAliasFilePath();
    const db = await Use.storage.load(aliasFilePath);
    const exist_util = new FileUtil(this).extractAlias(supposedAlias, aliasFilePath, db);

    var commandToRun = supposedAlias;

    if (exist_util["index"] == -2) {
      //Setup incomplete
      new FileUtil(this).setupIncompleteWarning();
      return;
    }
    else if (exist_util["index"] == -1) {
      const exit_message = 'Continue without using'
      const result = await new InquirerPrompts(this, exit_message, supposedAlias, db).findSuggestions();

      if (result === exit_message) {
        // console.warn(`${userAlias} is not a ${this.ctx.config.bin} command.`);
      }
      else {
        commandToRun = db[result];
      }
    }

    else if (exist_util["index"] >= 0) {
      commandToRun = exist_util["command"] //+ this.argv
    }

    new CommandUtil(this).runCommand(commandToRun, this.argv);

  }



}

Use.description = 'Use an alias for a Twilio CLI command';
Use.storage = new FilesystemStorage();
Use.aliases = ['use'];

module.exports = Use;


