# why

to emulate AWS Cloud SSM Parameter Store service

# get

## install

```sh
npm install --save-dev aws-ssm-parameter-store
```

## setup

```
plugins:
  - serverless-offline-ssm-parameter-store
  - serverless-offline
```

# use

* two sources of configuration

  1. `serverless.yml`:
     ```yml
     custom:
      ssm-parameter-store:
        parameters:
          '/offline/parameter/name.1': 'offline_parameter_value'
          '/offline/parameter/name.2': 1234
      ```

  2. external file provided in `serverless.yml`

     `serverless.yml`:

     ```yml
     custom:
      ssm-parameter-store:
        file: 'offline.parameters'
     ```

     `offline.parameters`:

     ```properties
     /offline/parameter/name.1=offline_file_parameter_value
     ```

* parameter from file overrides parameter with the same names from yml configuration

     `serverless.yml`:

     ```yml
     custom:
      ssm-parameter-store:
        parameters:
          '/offline/parameter/name': 'original value'
        file: 'offline.parameters'
     ```

     `offline.parameters`:

     ```properties
     /offline/parameter/name=overriden value
     ```

