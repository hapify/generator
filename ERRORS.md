# Errors sent by this module

Errors range: 2000 to 2999

- 2001 (GeneratorInternalError): Thrown when an unexpected error is triggered.
- 2002 (GeneratorRequestError): Thrown when routes are called with wrong arguments.
- 2003 (GeneratorRouteError): Thrown when an error occurs during routes processing (status >= 401).
- 2004 (GeneratorEvaluationError): Thrown when the evaluation of the JS template cause an error.
- 2005 (GeneratorTimeoutError): Thrown when the JS template is too long to process.
