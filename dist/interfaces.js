"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateInput = exports.TemplateEngine = exports.Access = exports.FieldSubType = exports.FieldType = void 0;
// ==================================================================
//  Fields
// ==================================================================
let FieldType = /** @class */ (() => {
    class FieldType {
    }
    FieldType.Boolean = 'boolean';
    FieldType.Number = 'number';
    FieldType.String = 'string';
    FieldType.DateTime = 'datetime';
    FieldType.Entity = 'entity';
    FieldType.Object = 'object';
    FieldType.File = 'file';
    return FieldType;
})();
exports.FieldType = FieldType;
let FieldSubType = /** @class */ (() => {
    class FieldSubType {
    }
    FieldSubType.Boolean = {};
    FieldSubType.Number = {
        Integer: 'integer',
        Float: 'float',
        Latitude: 'latitude',
        Longitude: 'longitude'
    };
    FieldSubType.String = {
        Email: 'email',
        Password: 'password',
        Url: 'url',
        Text: 'text',
        RichText: 'rich'
    };
    FieldSubType.DateTime = {
        Date: 'date',
        Time: 'time'
    };
    FieldSubType.Entity = {};
    FieldSubType.Object = {};
    FieldSubType.File = {
        Image: 'image',
        Video: 'video',
        Audio: 'audio',
        Document: 'document'
    };
    return FieldSubType;
})();
exports.FieldSubType = FieldSubType;
/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
let Access = /** @class */ (() => {
    class Access {
        /**
         * Returns the list of permissions ordered by restriction
         */
        static list() {
            return [Access.ADMIN, Access.OWNER, Access.AUTHENTICATED, Access.GUEST];
        }
    }
    Access.GUEST = 'guest';
    Access.AUTHENTICATED = 'auth';
    Access.OWNER = 'owner';
    Access.ADMIN = 'admin';
    return Access;
})();
exports.Access = Access;
// ==================================================================
//  Templates
// ==================================================================
let TemplateEngine = /** @class */ (() => {
    class TemplateEngine {
    }
    TemplateEngine.Hpf = 'hpf';
    TemplateEngine.JavaScript = 'js';
    return TemplateEngine;
})();
exports.TemplateEngine = TemplateEngine;
let TemplateInput = /** @class */ (() => {
    class TemplateInput {
    }
    TemplateInput.One = 'one';
    TemplateInput.All = 'all';
    return TemplateInput;
})();
exports.TemplateInput = TemplateInput;
//# sourceMappingURL=interfaces.js.map