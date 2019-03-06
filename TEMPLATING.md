# Templating

## Hapify Syntax

For documentation about Hapify Syntax, please refer to [syntax](https://bitbucket.org/tractrs/hapify-cli/src/master/libs/syntax/README.md).

## Model usage within a template

We will describe the structure of the object that represent a model when writing a template.

### Fields properties

A model is defined by a name and a list of fields.
A fields is defined by a name, a type, a sub-type and several boolean properties.
Those boolean properties are:

- *Primary*: Denotes if the field is the primary key.
- *Unique*: Denotes if the field is a unique value.
- *Label*: Denotes if the field is human-readable identifier.
- *Nullable*: Denotes if this field can be empty.
- *Multiple*: Denotes if the field is a list of values.
- *Embedded*: Denotes if the field should always be detailed.
- *Searchable*: Denotes if we can filter by this field.
- *Sortable*: Denotes if we can sort by this field.
- *Hidden*: Denotes if the field is readable by a user. This field is written *Hidden* to avoid conflict with reserved keywords.
- *Internal*: Denotes if the field is settable by a user, or this value is defined by the program.
- *Restricted*: Denotes if the access to this field is restricted to someones.
- *Ownership*: Denotes if the fields contains the identifier of entity's owner.

### Access controls by actions

Hapify uses 6 base actions:

- *Create*
- *Read*
- *Update*
- *Delete*
- *Search*
- *Count*

For each of these actions, Hapify let you define an access restriction. Available accesses are:

- *Admin* A logged-in super-admin user.
- *Owner* A logged-in user that own the entity.
- *Authenticated* A logged-in user.
- *Guest*: A user that is not logged-in.

Those access are inclusive. That means a restriction *Authenticated* includes *Owner* that also includes *Admin*.

### Object types

The following objects will be available in the template.

**Model object**

- `id` (string): an unique id
- `name` (string): The name of the model, as the user entered it.
- `names` (object): All names computed from the `name` property.
    - `raw` (string): The name of the model, as the user entered it. Example `Online item`.
    - `kebab` (string): The name with hyphens and lower case. Example `online-item`.
    - `big` (string): The name with hyphens and upper case. Example `ONLINE-ITEM`.
    - `snake` (string): The name with underscores and lower case. Example `online_item`.
    - `constant` (string): The name with underscores and upper case. Example `ONLINE_ITEM`.
    - `compact` (string): The name joined and lower case. Example `onlineitem`.
    - `camel` (string): The name as lower camel case. Example `onlineItem`.
    - `pascal` (string): The name as upper camel case. Example `OnlineItem`.
    - `lower` (string): The name as words in lower case. Example `online item`.
    - `capital` (string): The name as words with upper case on first letters. Example `Online Item`.
- `fields` - alias `f` (object): An object containing all fields, grouped in different arrays.
    - `list` - alias `l` (array): An array containing all fields of the model.
    - `primary` - alias `pr` (Field): The primary field of the model. `null` if no primary field is defined.
    - `unique` - alias `un` (array): An array containing all fields flagged as `unique`.
    - `label` - alias `lb` (array): An array containing all fields flagged as `label`.
    - `nullable` - alias `nu` (array): An array containing all fields flagged as `nullable`.
    - `multiple` - alias `ml` (array): An array containing all fields flagged as `multiple`.
    - `embedded` - alias `em` (array): An array containing all fields flagged as `embedded`.
    - `searchable` - alias `se` (array): An array containing all fields flagged as `searchable`.
    - `sortable` - alias `so` (array): An array containing all fields flagged as `sortable`.
    - `hidden` - alias `hd` (array): An array containing all fields flagged as `hidden`.
    - `internal` - alias `in` (array): An array containing all fields flagged as `internal`.
    - `restricted` - alias `rs` (array): An array containing all fields flagged as `restricted`.
    - `ownership` - alias `os` (array): An array containing all fields flagged as `ownership`.
    - `searchableLabel` - alias `sl` (array): An array containing all fields flagged as `label` and `searchable`. Useful for quick-search by label.
    - `filter` - alias `f` (Function): A function for filtering fields with a custom rule. Equivalent of `model.fields.list.filter`.
    - `references` - alias `r` - non-deep model only (array): An array containing all fields of type `entity`.
        - `filter` - alias `f` (function): A function for filtering the array.
- `dependencies` - alias `d` - non-deep model only (object): An object containing dependencies (to other models) of this model. A model has a dependency if one of this field is of type `entity`.
    - `list` - alias `l` (array): An array containing all dependency models, but self. These models are added as "deep models".
    - `self` - alias `s` (boolean): A boolean indicating if this model has a self-dependency.
    - `filter` - alias `f` (function): A function to filter dependencies.
        - First argument (function - default `(f) => f`): The filtering function receiving the referencer field (the entity field).
        - Second argument (boolean - default `true`): A boolean indicating if we should filter the self dependency.
- `referencedIn` - alias `ri` - non-deep model only (array): An array containing models that refer to this one. These models are added as "deep models".
    - `filter` - alias `f` (function): A function for filtering the array.
- `properties` - alias `p` (object): An object containing pre-computed properties from fields.
    - `fieldsCount` (number): The number of fields contained in the model.
    - `hasPrimary` (boolean): Denotes if the model has a primary field.
    - `hasUnique` (boolean): Denotes if the model has at least one unique field.
    - `hasLabel` (boolean): Denotes if the model has at least one label field.
    - `hasNullable` (boolean): Denotes if the model has at least one nullable field.
    - `hasMultiple` (boolean): Denotes if the model has at least one multiple field.
    - `hasEmbedded` (boolean): Denotes if the model has at least one embedded field.
    - `hasSearchable` (boolean): Denotes if the model has at least one searchable field.
    - `hasSortable` (boolean): Denotes if the model has at least one sortable field.
    - `hasHidden` (boolean): Denotes if the model has at least one hidden field.
    - `hasInternal` (boolean): Denotes if the model has at least one internal field.
    - `hasRestricted` (boolean): Denotes if the model has at least one restricted field.
    - `hasOwnership` (boolean): Denotes if the model has at least one ownership field.
    - `hasSearchableLabel` (boolean): Denotes if the model has at least one field marked as label and also searchable.
    - `hasDependencies` - non-deep model only (boolean): Denotes if the model has dependencies to other models or itself (through an `entity` field).
    - `isReferenced` - non-deep model only (boolean): Denotes if the model is referenced by other models.
    - `mainlyHidden` (boolean): Denotes if most of the fields are hidden (strictly).
    - `mainlyInternal` (boolean): Denotes if most of the fields are internal (strictly).
    - `isGeolocated` (boolean): Denotes if the model contains at least one latitude field and one longitude field.
    - `isGeoSearchable` (boolean): Denotes if the model contains at least one searchable latitude field and one searchable longitude field.
- `accesses` - alias `a` (object): An object containing all action's accesses grouped by action or restriction.
    - `list` - alias `l` (array): An array containing all action's accesses of the model.
    - `admin` - alias `ad` (array): An array containing all action's accesses restricted to `admin`.
    - `owner` - alias `ow` (array): An array containing all action's accesses restricted to `owner`.
    - `auth` - alias `au` (array): An array containing all action's accesses restricted to `authenticated`.
    - `guest` - alias `gs` (array): An array containing all action's accesses restricted to `guest`.
    - `create` - alias `c` (object): An object containing the `create` action's access.
    - `read` - alias `r` (object): An object containing the `read` action's access.
    - `update` - alias `u` (object): An object containing the `update` action's access.
    - `remove` - alias `d` (object): An object containing the `delete` action's access.
    - `search` - alias `s` (object): An object containing the `search` action's access.
    - `count` - alias `n` (object): An object containing the `count` action's access.
    - `filter` - alias `f` (Function): A function for filtering action's accesses with a custom rule. Equivalent of `model.accesses.list.filter`.
    - `properties` - alias `p` (object): An object containing pre-computed properties from action's accesses.
        - `onlyAdmin` (boolean): Denotes if the model only contains actions restricted to `admin`.
        - `onlyOwner` (boolean): Denotes if the model only contains actions restricted to `owner`.
        - `onlyAuth` (boolean): Denotes if the model only contains actions restricted to `authenticated`.
        - `onlyGuest` (boolean): Denotes if the model only contains actions restricted to `guest`.
        - `maxAdmin` (boolean): Denotes if the most permissive access is `admin`.
        - `maxOwner` (boolean): Denotes if the most permissive access is `owner`.
        - `maxAuth` (boolean): Denotes if the most permissive access is `authenticated`.
        - `maxGuest` (boolean): Denotes if the most permissive access is `guest`.
        - `noAdmin` (boolean): Denotes if there is no action restricted to `admin`.
        - `noOwner` (boolean): Denotes if there is no action restricted to `owner`.
        - `noAuth` (boolean): Denotes if there is no action restricted to `authenticated`.
        - `noGuest` (boolean): Denotes if there is no action restricted to `guest`.
        - `hasAdmin` (boolean): Denotes if there is at least one action restricted to `admin`.
        - `hasOwner` (boolean): Denotes if there is at least one action restricted to `owner`.
        - `hasAuth` (boolean): Denotes if there is at least one action restricted to `authenticated`.
        - `hasGuest` (boolean): Denotes if there is at least one action restricted to `guest`.

**Field object**

- `name` (string): The name of the field, as the user entered it.
- `names` (object): All names computed from the `name` property. As for the field object.
    - `raw` (string): The name of the field, as the user entered it. Example `first_name`.
    - `kebab` (string): The name with hyphens and lower case. Example `first-name`.
    - `big` (string): The name with hyphens and upper case. Example `FIRST-NAME`.
    - `snake` (string): The name with underscores and lower case. Example `first_name`.
    - `constant` (string): The name with underscores and upper case. Example `FIRST_NAME`.
    - `compact` (string): The name joined and lower case. Example `firstname`.
    - `camel` (string): The name as lower camel case. Example `firstName`.
    - `pascal` (string): The name as upper camel case. Example `FirstName`.
    - `lower` (string): The name as words in lower case. Example `first name`.
    - `capital` (string): The name as words with upper case on first letters. Example `First Name`.
- `primary` (boolean): Indicates if the field is flagged as `primary`.
- `unique` (boolean): Indicates if the field is flagged as `unique`.
- `label` (boolean): Indicates if the field is flagged as `label`.
- `nullable` (boolean): Indicates if the field is flagged as `nullable`.
- `multiple` (boolean): Indicates if the field is flagged as `multiple`.
- `embedded` (boolean): Indicates if the field is flagged as `embedded`.
- `searchable` (boolean): Indicates if the field is flagged as `searchable`.
- `sortable` (boolean): Indicates if the field is flagged as `sortable`.
- `hidden` (boolean): Indicates if the field is flagged as `hidden`.
- `internal` (boolean): Indicates if the field is flagged as `internal`.
- `restricted` (boolean): Indicates if the field is flagged as `restricted`.
- `ownership` (boolean): Indicates if the field is flagged as `ownership`.
- `type` (string): The type of the field. Can be `string`, `number`, `boolean`, `datetime` or `entity`.
- `subtype` (string): The subtype of the field. The available values depend on the `type`:
    - `string`: Can be `null`, `email`, `password` `text` or `rich`.
    - `number`: Can be `null`, `integer`, `float`, `latitude` or `longitude`.
    - `boolean`: Is `null`.
    - `datetime`: Can be `null`, `date` or `time`.
    - `entity`: Is `null`.
- `reference` (string): The id of the target model if the field is of type `entity`. `null` otherwise
- `model` - alias `m` (object): The target model object if the field is of type `entity`. `null` otherwise

**Access object**

- `action` (string): The name of the action. It can be `create`, `read`, `update`, `remove`, `search` or `count`.
- `admin` (boolean): Indicates if the selected access is `admin`.
- `owner` (boolean): Indicates if the selected access is `owner`.
- `auth` (boolean): Indicates if the selected access is `authenticated`.
- `guest` (boolean): Indicates if the selected access is `guest`.
- `gteAdmin` (boolean): Denotes if the selected access is greater or equal than `admin` (should always be `true`).
- `gteOwner` (boolean): Denotes if the selected access is greater or equal than `owner`.
- `gteAuth` (boolean): Denotes if the selected access is greater or equal than `authenticated`.
- `gteGuest` (boolean): Denotes if the selected access is greater or equal than `guest`.
- `lteAdmin` (boolean): Denotes if the selected access is less or equal than `admin`.
- `lteOwner` (boolean): Denotes if the selected access is less or equal than `owner`.
- `lteAuth` (boolean): Denotes if the selected access is less or equal than `authenticated`.
- `lteGuest` (boolean): Denotes if the selected access is less or equal than `guest` (should always be `true`).

### Model injection

The template's input can be defined as `one` or `all` models.
During the generation process, if defined as `one`, the template will be called for each model. Therefore it generates one output file for each model.
If defined as `all`, the template will be called once for all models. Then it will generate one output file.

#### Single model

If the template requires one models, therefore, an object `model` (alias `m`) will be available as a global variable in the template.
In a `hpf` template it will be available under `M`.

#### Multiple models

If the template requires all the models, therefore, an array `models` (alias `m`) will be available as a global variable in the template.
This array contains all the available models.
In a `hpf` template it will be available under `M`.