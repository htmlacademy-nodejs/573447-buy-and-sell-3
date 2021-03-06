import { CliCommandName } from '~/common/enums';
import { USER_ARGV_IDX, COMMAND_ARGS_IDX } from '~/common/constants';
import { Cli } from './cli/cli';

const userArguments = process.argv.slice(USER_ARGV_IDX);
const [userCommand] = userArguments;
const commandArguments = userArguments.slice(COMMAND_ARGS_IDX);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!userArguments.length || !Cli[userCommand]) {
  Cli[CliCommandName.HELP].run(commandArguments);
} else {
  Cli[userCommand].run(commandArguments);
}
