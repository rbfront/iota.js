import test from 'ava'
import { createGetTransactionObjects } from '../../lib/api/extended'
import { INVALID_HASH_ARRAY } from '../../lib/errors'
import { provider } from '../../lib/utils'
import { bundle, bundleWithZeroValue } from '../samples/bundle'

import '../nocks/getTrytes'

const getTransactionObjects = createGetTransactionObjects(provider())
const hashes = [bundle[0].hash]
const transactions = [bundle[0]]

test('getTransactionObjects() resolves to correct transactions.', async t => { 
    t.deepEqual(
        await getTransactionObjects(hashes),
        transactions,
        'getTransactionObjects() should resolve to correct transactions.'    
    )
})


test('getTransactionObjects() rejects with correct error for invalid hash.', t => {
    const invalidHashes = ['asdasDSFDAFD']

    t.is(
        t.throws(() => getTransactionObjects(invalidHashes), Error).message,
        `${ INVALID_HASH_ARRAY }: ${ invalidHashes[0] }`,
        'getTransactionObjects() should throw correct error for invalid hash.' 
    )
})

test.cb('getTransactionObjects() invokes callback', t => {
    getTransactionObjects(hashes, t.end)
})

test.cb('getTransactionObjects() passes correct arguments to callback', t => {
    getTransactionObjects(hashes, (err, res) => {
        t.is(
            err,
            null,
            'getTransactionObjects() should pass null as first argument in callback for successuful requests'
        )
      
        t.deepEqual(
            res,
            transactions,
            'getTransactionObjects() should pass the correct response as second argument in callback'
        )
      
        t.end()  
    })
})