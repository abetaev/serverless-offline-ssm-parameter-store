const readFile = (path) =>
  require('fs').readFileSync(path, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map(line => line.split(/=(.*)/))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

module.exports = class {
  constructor(serverless) {
    const commands = serverless.processedInput.commands
    if (!(commands[0] === 'offline' && commands[1] === 'start')) {
      return
    } 

    const config = serverless.service.custom['ssm-parameter-store'];

    const values = Object.assign(
      {},
      config.parameters,
      config.file ? readFile(config.file) : {}
    )

    const aws = serverless.getProvider('aws');
    const request = aws.request.bind(aws);

    aws.request = (service, method, { Name }, options) => {
      if (service !== 'SSM' || method !== 'getParameter')
        return request(service, method, params, options);

      const Value = values[Name];

      if (!Value) {
        return Promise.reject(`parameter ${Name} is not in ${config.file}`);
      }

      return Promise.resolve({
        Parameter: {
          Value
        }
      });
    };

    serverless.setProvider('aws', aws);

    serverless.cli.log('Offline SSM parameters loaded.')

  }
}