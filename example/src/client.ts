import { create } from '@ch1/browser-dna';
import { Xhr } from '@ch1/xhr';

console.log('Fingerprinting...');
const fingerprint = create();

console.log('Fingerprinted', fingerprint);
Xhr().post('/login', { fingerprint })
  .then(console.log.bind(console, 'Success!'))
  .catch(console.log.bind(console, 'Failure!'));
