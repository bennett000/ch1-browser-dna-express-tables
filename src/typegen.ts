export interface BrowserViews {
  depth: number;
  height: number;
  width: number;
  index: number;
  ts_created: number;
}

export interface ClientFingerprints {
  index: number;
  browser_view_index: number;
  concurrency: number;
  os_index: number;
  plugin_index: number;
  server_fp_index: number;
  tzoffset: number;
  usescookies: boolean;
  usestouch: boolean;
  ts_created: number;
}

export interface ConnectionFingerprints {
  referrer_index: number;
  ip_index: number;
  verb_index: number;
  index: number;
  ts_created: number;
}

export interface Hits {
  index: number;
  client_fp_index: number;
  server_fp_index: number;
  connection_fp_index: number;
  ts_created: number;
}

export interface HttpVerbs {
  verb: string;
  index: number;
  ts_created: number;
}

export interface Ipv4 {
  ip: string;
  index: number;
  ts_created: number;
}

export interface Languages {
  cslocales: string;
  index: number;
  ts_created: number;
}

export interface PluginDescs {
  csdescs: string;
  index: number;
  ts_created: number;
}

export interface Referrers {
  referrer: string;
  index: number;
  ts_created: number;
}

export interface ServerFingerprints {
  language_index: number;
  user_agent_index: number;
  usesdnt: boolean;
  index: number;
  ts_created: number;
}

export interface Systems {
  osstring: string;
  index: number;
  ts_created: number;
}

export interface UserAgents {
  string: string;
  index: number;
  ts_created: number;
}

export interface DbSchema {
  BrowserViews: BrowserViews;
  ClientFingerprints: ClientFingerprints;
  ConnectionFingerprints: ConnectionFingerprints;
  Hits: Hits;
  HttpVerbs: HttpVerbs;
  Ipv4: Ipv4;
  Languages: Languages;
  PluginDescs: PluginDescs;
  Referrers: Referrers;
  ServerFingerprints: ServerFingerprints;
  Systems: Systems;
  UserAgents: UserAgents;
}
