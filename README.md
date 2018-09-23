# CH1 Browser DNA Express Tables

[![CircleCI](https://circleci.com/gh/bennett000/ch1-browser-dna-express-tables.svg?style=svg)](https://circleci.com/gh/bennett000/ch1-browser-dna-express-tables)

_This is not well maintained_

## Installation

`yarn add @ch1/browser-dna-express-tables`

## What is This

Fingerprinting middleware for express. This middleware works with
[@ch1/browser-dna-express](https://www.npmjs.com/package/@ch1/browser-dna-express 'Browser fingerprinting express middleware') and stores its fingerpritns
in a sql database

## Morality of Browser Fingerprinting

Fingerprinting can be a hot button topic and for good reason. Privacy on
the internet is an illusion. We should expect some modicum of privacy but
we should also be aware of the limitations of the tools we use. This library
and other - more robust - libraries like [Panopticlick](https://github.com/EFForg/panopticlick-python 'Panopticlick EFF')
show just how much trivial seeming data we give away that actually "marks"
us.

Ultimately your fingerprint from a library like this, in combination with an
IP address is not _really_ enough to uniquely identify most people but it
_really_ shrinks the pool, especially in certain areas.

### Why Would We Want This?

While we want and should have privacy there is a strong use case for having
our connections be semi-identifiable.

Consider the following:

- You run a web service of some sort
- You're getting a _lot_ of connections from one IP
- The IP represents a huge institution that has a lot of legitimate users
  but due to NAT they all appear as one user

This is where at least fingerprinting headers and connection detail server
side helps.

Another case would be implementing an app that uses semi-anonymous sharing
having a JS + server side fingerprint would allow the app to _somewhat_
distinguish anonymous connections for the purpose of say short term chat.

## Usage

Use at the top level of an express app

```ts
import { fingerprint } from '@ch1/browser-dna-express';
import { fingerprintStore, schema } from '@ch1/browser-dna-express-tables';
import { create as createSql } from '@ch1/sql-tables';

const sql = createSql(/* db connection config */, {
  ...schema,
  /* custom schema here */
})

// where app is your express app
app.use(fingerprint());
app.use(fingerprintStore(sql));
```

This should store fingerprint data on _every_ request, which is really
expensive.

## License

[LGPL](./LICENSE 'Lesser GNU Public License')
