// Copyright 2014 Andrei Karpushonak

'use strict'

var ECMA_SIZES = {
    STRING: 2,
    BOOLEAN: 4,
    NUMBER: 8
};

function sizeOfObject(object) {
    if (object == null) {
        return 0
    }

    var bytes = 0
    for (var key in object) {
        if (!Object.hasOwnProperty.call(object, key)) {
            continue
        }

        bytes += sizeof(key)
        try {
            bytes += sizeof(object[key])
        } catch (ex) {
            if (ex instanceof RangeError) {
                // circular reference detected, final result might be incorrect
                // let's be nice and not throw an exception
                bytes = 0
            }
        }
    }

    return bytes
}

/**
 * Main module's entry point
 * Calculates Bytes for the provided parameter
 * @param object - handles object/string/boolean/
 * @returns {*}
 */
function sizeof(object) {

    var objectType = typeof (object)
    switch (objectType) {
        case 'string':
            return object.length * ECMA_SIZES.STRING
        case 'boolean':
            return ECMA_SIZES.BOOLEAN
        case 'number':
            return ECMA_SIZES.NUMBER
        case 'object':
            if (Array.isArray(object)) {
                return object.map(sizeof).reduce(function (acc, curr) {
                    return acc + curr
                }, 0)
            } else {
                return sizeOfObject(object)
            }
        default:
            return 0
    }
}

module.exports = sizeof
