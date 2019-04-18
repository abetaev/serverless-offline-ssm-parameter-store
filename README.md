# description

emulates AWS Cloud SSM Parameter Store service

# use

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

# features

* two sources of configuration

  1. serverless.yml
     ```yml
     custom:
      ssm-parameter-store:
        parameters:
          '/offline/parameter/name.1': offline_parameter_value'
          '/offline/parameter/name.2': 1234
      ```

  2. external file

     ```yml
     custom:
      ssm-parameter-store:
        file: 'offline.parameters'
     ```

     ```properties
     /offline/parameter/name.1=offline_parameter_value_override
     ```

* parameter from file overrides parameter with the same names from yml configuration