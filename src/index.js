const readFile = (path) =>
  require('fs').readFileSync(path, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map(line => line.split(/=(.*)/))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

class ServerlessOfflineSSMParameterStore {
  constructor(serverless) {
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
  }
}

module.exports = ServerlessOfflineSSMParameterStore;
