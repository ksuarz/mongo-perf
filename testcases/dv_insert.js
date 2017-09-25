if (typeof(tests) != "object") {
    tests = [];
}

/**
 * Creates a document validation insertion performance test named 'name' that inserts the document
 * 'doc' into a collection with document validator 'validator'. Also generates a "comparison" test
 * that does not use the validator to serve as a benchmark for the overhead of document validation.
 *
 * If 'jsonSchema' exists, additionally generates a third test with a validator using the schema
 * wrapped in $jsonSchema. The schema should be semantically equivalent to 'validator' and is
 * intended to test the overhead of $jsonSchema.
 */
function createDocValidationTest(name, doc, validator, jsonSchema) {
    var baseTags = ["insert", "DocValidation"];
    // Add a baseline test that simply inserts 'doc'.
    tests.push({
        name: name + ".Compare",
        tags: ["compare"].concat(baseTags),
        pre: function(collection) {
            collection.drop();
        },
        ops: [{op: "insert", doc: doc}]
    });

    // Add a test that inserts 'doc' into a collection with validator 'validator'.
    tests.push({
        name: name,
        tags: ["regression"].concat(baseTags),
        pre: function(collection) {
            collection.drop();
            collection.runCommand("create", {validator: validator});
        },
        ops: [{op: "insert", doc: doc}]
    });

    // Add a test that inserts 'doc' into a collection with validator 'jsonSchema', if requested.
    if (jsonSchema !== undefined) {
        tests.push({
            name: name + ".JSONSchema",
            tags: ["regression", "jsonschema"].concat(baseTags),
            pre: function(collection) {
                collection.drop();
                collection.runCommand("create", {validator: {$jsonSchema: jsonSchema}});
            },
            ops: [{op: "insert", doc: doc}]
        });
    }
}

// Tests inserting documents with a field which must exist and be an integer. This targets the use
// of $type and $exists on a single field.
var doc = {a: {"#RAND_INT": [0, 10000]}};
var validator = {$and: [{a: {$exists: true}}, {a: {$type: 16}}]};
createDocValidationTest("Insert.DocValidation.OneInt", doc, validator);

// Like the "OneInt" test, but validates that ten fields exist and are integers.
doc = {
    a: {"#RAND_INT": [0, 10000]},
    b: {"#RAND_INT": [0, 10000]},
    c: {"#RAND_INT": [0, 10000]},
    d: {"#RAND_INT": [0, 10000]},
    e: {"#RAND_INT": [0, 10000]},
    f: {"#RAND_INT": [0, 10000]},
    g: {"#RAND_INT": [0, 10000]},
    h: {"#RAND_INT": [0, 10000]},
    i: {"#RAND_INT": [0, 10000]},
    j: {"#RAND_INT": [0, 10000]}
};
validator = {
    $and: [
        {a: {$exists: true}}, {a: {$type: 16}}, {b: {$exists: true}}, {b: {$type: 16}},
        {c: {$exists: true}}, {c: {$type: 16}}, {d: {$exists: true}}, {d: {$type: 16}},
        {e: {$exists: true}}, {e: {$type: 16}}, {f: {$exists: true}}, {f: {$type: 16}},
        {g: {$exists: true}}, {g: {$type: 16}}, {h: {$exists: true}}, {h: {$type: 16}},
        {a: {$exists: true}}, {a: {$type: 16}}, {i: {$exists: true}}, {i: {$type: 16}},
        {j: {$exists: true}}, {j: {$type: 16}}
    ]
};
createDocValidationTest("Insert.DocValidation.TenInt", doc, validator);

// Like the "OneInt" test, but validates that twenty fields exist and are integers. Also generates a
// comparison JSON Schema test.
doc = {
    a: {"#RAND_INT": [0, 10000]},
    b: {"#RAND_INT": [0, 10000]},
    c: {"#RAND_INT": [0, 10000]},
    d: {"#RAND_INT": [0, 10000]},
    e: {"#RAND_INT": [0, 10000]},
    f: {"#RAND_INT": [0, 10000]},
    g: {"#RAND_INT": [0, 10000]},
    h: {"#RAND_INT": [0, 10000]},
    i: {"#RAND_INT": [0, 10000]},
    j: {"#RAND_INT": [0, 10000]},
    k: {"#RAND_INT": [0, 10000]},
    l: {"#RAND_INT": [0, 10000]},
    m: {"#RAND_INT": [0, 10000]},
    n: {"#RAND_INT": [0, 10000]},
    o: {"#RAND_INT": [0, 10000]},
    p: {"#RAND_INT": [0, 10000]},
    q: {"#RAND_INT": [0, 10000]},
    r: {"#RAND_INT": [0, 10000]},
    s: {"#RAND_INT": [0, 10000]},
    t: {"#RAND_INT": [0, 10000]}
};
validator = {
    $and: [
        {a: {$exists: true}}, {a: {$type: 16}}, {b: {$exists: true}}, {b: {$type: 16}},
        {c: {$exists: true}}, {c: {$type: 16}}, {d: {$exists: true}}, {d: {$type: 16}},
        {e: {$exists: true}}, {e: {$type: 16}}, {f: {$exists: true}}, {f: {$type: 16}},
        {g: {$exists: true}}, {g: {$type: 16}}, {h: {$exists: true}}, {h: {$type: 16}},
        {a: {$exists: true}}, {a: {$type: 16}}, {i: {$exists: true}}, {i: {$type: 16}},
        {j: {$exists: true}}, {j: {$type: 16}}, {k: {$exists: true}}, {k: {$type: 16}},
        {l: {$exists: true}}, {l: {$type: 16}}, {m: {$exists: true}}, {m: {$type: 16}},
        {n: {$exists: true}}, {n: {$type: 16}}, {o: {$exists: true}}, {o: {$type: 16}},
        {p: {$exists: true}}, {p: {$type: 16}}, {q: {$exists: true}}, {q: {$type: 16}},
        {r: {$exists: true}}, {r: {$type: 16}}, {s: {$exists: true}}, {s: {$type: 16}},
        {t: {$exists: true}}, {t: {$type: 16}},
    ]
};
var jsonSchema = {
    properties: {
        a: {bsonType: "int"},
        b: {bsonType: "int"},
        c: {bsonType: "int"},
        d: {bsonType: "int"},
        e: {bsonType: "int"},
        f: {bsonType: "int"},
        g: {bsonType: "int"},
        h: {bsonType: "int"},
        i: {bsonType: "int"},
        j: {bsonType: "int"},
        k: {bsonType: "int"},
        l: {bsonType: "int"},
        m: {bsonType: "int"},
        n: {bsonType: "int"},
        o: {bsonType: "int"},
        p: {bsonType: "int"},
        q: {bsonType: "int"},
        r: {bsonType: "int"},
        s: {bsonType: "int"},
        t: {bsonType: "int"},
    },
    required: [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"
    ]
};
createDocValidationTest("Insert.DocValidation.TwentyInt", doc, validator, jsonSchema);

// Tests a JSON Schema that enforces a variety of constraints on twenty fields (not including the
// _id).
doc = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: "f",
    g: "g",
    h: "h",
    i: "i",
    j: "j",
    k: [0, 1, 2],
    l: ["a", "b", "c"],
    m: [{foo: "bar"}],
    n: [0, "a", {foo: "bar"}],
    o: [[1, 2], [3, 4]],
    p: {sku: "123"},
    q: {sku: 123},
    r: {value: 10},
    s: {value: -10},
    t: {}
};
validator = {
    $jsonSchema: {
        minProperties: 15,
        maxProperties: 21,
        properties: {
            a: {type: "number"},
            b: {bsonType: "number"},
            c: {bsonType: "double"},
            d: {type: ["number", "string"]},
            e: {minimum: 0},
            f: {type: "string"},
            g: {bsonType: "string"},
            h: {type: ["string", "array"]},
            i: {minLength: 1},
            j: {maxLength: 1},
            k: {type: "array"},
            l: {bsonType: "array"},
            m: {bsonType: ["array", "object"]},
            n: {minItems: 1},
            o: {maxItems: 10},
            p: {type: "object"},
            q: {bsonType: "object"},
            r: {type: ["object", "string"]},
            s: {minProperties: 1},
            t: {maxProperties: 15}
        },
        required: ["_id", "a", "b", "f", "g", "k", "l", "p", "q"]
    }
}
createDocValidationTest("Insert.DocValidation.JSONSchema", doc, validator);
