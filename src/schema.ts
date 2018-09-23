import {
  mutateStructIntoSchemaStructs,
  strictify,
  Schema,
  SchemaStrict,
  SchemaStruct
} from '@ch1/sql-tables';
import { deepFreeze } from '@ch1/utility';

const schemaProto: SchemaStruct = {
  index: {
    constraints: ['Automatic', 'DbModifyOnly', 'NotNull'],
    type: 'UInt32'
  },
  ts_created: {
    constraints: ['DbModifyOnly'],
    type: 'TimestampS'
  }
};

const baseSchema: Schema = {
  BrowserViews: {
    struct: {
      depth: 'UInt16',
      height: 'UInt16',
      width: 'UInt16'
    },
    unique: [['depth', 'height', 'width']]
  },
  ClientFingerprints: {
    struct: {
      index: {
        constraints: ['Automatic', 'DbModifyOnly', 'NotNull'],
        type: 'UInt64'
      },
      browser_view_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'BrowserViews' },
        type: 'UInt32'
      },
      concurrency: 'UInt16',
      os_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'Systems' },
        type: 'UInt32'
      },
      plugin_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'PluginDescs' },
        type: 'UInt32'
      },
      server_fp_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'ServerFingerprints' },
        type: 'UInt32'
      },
      tzOffset: 'Int16',
      usesCookies: 'Boolean',
      usesTouch: 'Boolean'
    },
    unique: [
      [
        'browser_view_index',
        'concurrency',
        'os_index',
        'plugin_index',
        'server_fp_index',
        'tzOffset',
        'usesCookies',
        'usesTouch'
      ]
    ]
  },
  ConnectionFingerprints: {
    struct: {
      referrer_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'Referrers' },
        type: 'UInt32'
      },
      ip_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'Ipv4' },
        type: 'UInt32'
      },
      verb_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'HttpVerbs' },
        type: 'UInt32'
      }
    },
    unique: [['referrer_index', 'ip_index', 'verb_index']]
  },
  Hits: {
    index: {
      constraints: ['Automatic', 'DbModifyOnly', 'NotNull'],
      type: 'UInt64'
    },
    client_fp_index: {
      relation: { prop: 'index', struct: 'ClientFingerprints' },
      type: 'UInt64'
    },
    server_fp_index: {
      constraints: ['NotNull'],
      relation: { prop: 'index', struct: 'ServerFingerprints' },
      type: 'UInt32'
    },
    connection_fp_index: {
      constraints: ['NotNull'],
      relation: { prop: 'index', struct: 'ConnectionFingerprints' },
      type: 'UInt32'
    }
  },
  HttpVerbs: {
    verb: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 16
    }
  },
  Ipv4: {
    ip: {
      constraints: ['Unique'],
      type: 'Ipv4'
    }
  },
  Languages: {
    csLocales: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 64
    }
  },
  PluginDescs: {
    csDescs: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 1024
    }
  },
  Referrers: {
    referrer: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 2000
    }
  },
  ServerFingerprints: {
    struct: {
      language_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'Languages' },
        type: 'UInt32'
      },
      user_agent_index: {
        constraints: ['NotNull'],
        relation: { prop: 'index', struct: 'UserAgents' },
        type: 'UInt32'
      },
      usesDnt: 'Boolean'
    },
    unique: [['language_index', 'user_agent_index', 'usesDnt']]
  },
  Systems: {
    osString: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 32
    }
  },
  UserAgents: {
    string: {
      constraints: ['Unique'],
      type: 'String',
      typeMax: 512
    }
  }
};

export const schema: SchemaStrict = deepFreeze<SchemaStrict>(
  strictify(mutateStructIntoSchemaStructs(schemaProto, baseSchema))
);
