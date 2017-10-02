if (typeof(tests) != "object") {
    tests = [];
}

/**
 * Creates a document validation insertion performance test named 'name' that inserts the document
 * 'doc' into a collection with document validator 'validator' or 'jsonSchema'. Also generates a
 * "comparison" test that does not use the validator to serve as a benchmark for the overhead of
 * document validation.
 *
 * If both 'validator' and 'jsonSchema' are specified, the two should be semantically equivalent,
 * such that the test compares the performance of JSON Schema against normal MongoDB match
 * expressions.
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
    if (validator !== undefined) {
        tests.push({
            name: name,
            tags: ["regression"].concat(baseTags),
            pre: function(collection) {
                collection.drop();
                assert.commandWorked(collection.runCommand("create", {validator: validator}));
            },
            ops: [{op: "insert", doc: doc}]
        });
    }

    // Add a test that inserts 'doc' into a collection with validator 'jsonSchema'.
    if (jsonSchema !== undefined) {
        tests.push({
            name: name + ".JSONSchema",
            tags: ["regression", "jsonschema"].concat(baseTags),
            pre: function(collection) {
                collection.drop();
                assert.commandWorked(
                    collection.runCommand("create", {validator: {$jsonSchema: jsonSchema}}));
            },
            ops: [{op: "insert", doc: doc}]
        });
    }
}

/**
 * Tests inserting documents with a field which must exist and be an integer. This targets the use
 * of $type and $exists on a single field. Also generates a comparison JSON Schema test.
 */
var doc = {a: {"#RAND_INT": [0, 10000]}};
var validator = {$and: [{a: {$exists: true}}, {a: {$type: 16}}]};
var jsonSchema = {properties: {a: {bsonType: "integer"}}, required: ["a"]};
createDocValidationTest("Insert.DocValidation.OneInt", doc, validator, jsonSchema);

/**
 * Like the "OneInt" test, but validates that ten fields exist and are integers.
 */
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
        {i: {$exists: true}}, {i: {$type: 16}}, {j: {$exists: true}}, {j: {$type: 16}},
    ]
};
createDocValidationTest("Insert.DocValidation.TenInt", doc, validator);

/**
 * Like the "OneInt" test, but validates that twenty fields exist and are integers. Also generates a
 * comparison JSON Schema test.
*/
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
        {i: {$exists: true}}, {i: {$type: 16}}, {j: {$exists: true}}, {j: {$type: 16}},
        {k: {$exists: true}}, {k: {$type: 16}}, {l: {$exists: true}}, {l: {$type: 16}},
        {m: {$exists: true}}, {m: {$type: 16}}, {n: {$exists: true}}, {n: {$type: 16}},
        {o: {$exists: true}}, {o: {$type: 16}}, {p: {$exists: true}}, {p: {$type: 16}},
        {q: {$exists: true}}, {q: {$type: 16}}, {r: {$exists: true}}, {r: {$type: 16}},
        {s: {$exists: true}}, {s: {$type: 16}}, {t: {$exists: true}}, {t: {$type: 16}},
    ]
};
jsonSchema = {
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

/**
 * Like the "OneInt" test, but validates that 150 fields exist and are integers. Also generates a
 * comparison JSON Schema test.
 */
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
    t: {"#RAND_INT": [0, 10000]},
    u: {"#RAND_INT": [0, 10000]},
    v: {"#RAND_INT": [0, 10000]},
    w: {"#RAND_INT": [0, 10000]},
    x: {"#RAND_INT": [0, 10000]},
    y: {"#RAND_INT": [0, 10000]},
    z: {"#RAND_INT": [0, 10000]},
    aa: {"#RAND_INT": [0, 10000]},
    ab: {"#RAND_INT": [0, 10000]},
    ac: {"#RAND_INT": [0, 10000]},
    ad: {"#RAND_INT": [0, 10000]},
    ae: {"#RAND_INT": [0, 10000]},
    af: {"#RAND_INT": [0, 10000]},
    ag: {"#RAND_INT": [0, 10000]},
    ah: {"#RAND_INT": [0, 10000]},
    ai: {"#RAND_INT": [0, 10000]},
    aj: {"#RAND_INT": [0, 10000]},
    ak: {"#RAND_INT": [0, 10000]},
    al: {"#RAND_INT": [0, 10000]},
    am: {"#RAND_INT": [0, 10000]},
    an: {"#RAND_INT": [0, 10000]},
    ao: {"#RAND_INT": [0, 10000]},
    ap: {"#RAND_INT": [0, 10000]},
    aq: {"#RAND_INT": [0, 10000]},
    ar: {"#RAND_INT": [0, 10000]},
    as: {"#RAND_INT": [0, 10000]},
    at: {"#RAND_INT": [0, 10000]},
    au: {"#RAND_INT": [0, 10000]},
    av: {"#RAND_INT": [0, 10000]},
    aw: {"#RAND_INT": [0, 10000]},
    ax: {"#RAND_INT": [0, 10000]},
    ay: {"#RAND_INT": [0, 10000]},
    az: {"#RAND_INT": [0, 10000]},
    aaa: {"#RAND_INT": [0, 10000]},
    aab: {"#RAND_INT": [0, 10000]},
    aac: {"#RAND_INT": [0, 10000]},
    aad: {"#RAND_INT": [0, 10000]},
    aae: {"#RAND_INT": [0, 10000]},
    aaf: {"#RAND_INT": [0, 10000]},
    aag: {"#RAND_INT": [0, 10000]},
    aah: {"#RAND_INT": [0, 10000]},
    aai: {"#RAND_INT": [0, 10000]},
    aaj: {"#RAND_INT": [0, 10000]},
    aak: {"#RAND_INT": [0, 10000]},
    aal: {"#RAND_INT": [0, 10000]},
    aam: {"#RAND_INT": [0, 10000]},
    aan: {"#RAND_INT": [0, 10000]},
    aao: {"#RAND_INT": [0, 10000]},
    aap: {"#RAND_INT": [0, 10000]},
    aaq: {"#RAND_INT": [0, 10000]},
    aar: {"#RAND_INT": [0, 10000]},
    aas: {"#RAND_INT": [0, 10000]},
    aat: {"#RAND_INT": [0, 10000]},
    aau: {"#RAND_INT": [0, 10000]},
    aav: {"#RAND_INT": [0, 10000]},
    aaw: {"#RAND_INT": [0, 10000]},
    aax: {"#RAND_INT": [0, 10000]},
    aay: {"#RAND_INT": [0, 10000]},
    aaz: {"#RAND_INT": [0, 10000]},
    aaaa: {"#RAND_INT": [0, 10000]},
    aaab: {"#RAND_INT": [0, 10000]},
    aaac: {"#RAND_INT": [0, 10000]},
    aaad: {"#RAND_INT": [0, 10000]},
    aaae: {"#RAND_INT": [0, 10000]},
    aaaf: {"#RAND_INT": [0, 10000]},
    aaag: {"#RAND_INT": [0, 10000]},
    aaah: {"#RAND_INT": [0, 10000]},
    aaai: {"#RAND_INT": [0, 10000]},
    aaaj: {"#RAND_INT": [0, 10000]},
    aaak: {"#RAND_INT": [0, 10000]},
    aaal: {"#RAND_INT": [0, 10000]},
    aaam: {"#RAND_INT": [0, 10000]},
    aaan: {"#RAND_INT": [0, 10000]},
    aaao: {"#RAND_INT": [0, 10000]},
    aaap: {"#RAND_INT": [0, 10000]},
    aaaq: {"#RAND_INT": [0, 10000]},
    aaar: {"#RAND_INT": [0, 10000]},
    aaas: {"#RAND_INT": [0, 10000]},
    aaat: {"#RAND_INT": [0, 10000]},
    aaau: {"#RAND_INT": [0, 10000]},
    aaav: {"#RAND_INT": [0, 10000]},
    aaaw: {"#RAND_INT": [0, 10000]},
    aaax: {"#RAND_INT": [0, 10000]},
    aaay: {"#RAND_INT": [0, 10000]},
    aaaz: {"#RAND_INT": [0, 10000]},
    aaaaa: {"#RAND_INT": [0, 10000]},
    aaaab: {"#RAND_INT": [0, 10000]},
    aaaac: {"#RAND_INT": [0, 10000]},
    aaaad: {"#RAND_INT": [0, 10000]},
    aaaae: {"#RAND_INT": [0, 10000]},
    aaaaf: {"#RAND_INT": [0, 10000]},
    aaaag: {"#RAND_INT": [0, 10000]},
    aaaah: {"#RAND_INT": [0, 10000]},
    aaaai: {"#RAND_INT": [0, 10000]},
    aaaaj: {"#RAND_INT": [0, 10000]},
    aaaak: {"#RAND_INT": [0, 10000]},
    aaaal: {"#RAND_INT": [0, 10000]},
    aaaam: {"#RAND_INT": [0, 10000]},
    aaaan: {"#RAND_INT": [0, 10000]},
    aaaao: {"#RAND_INT": [0, 10000]},
    aaaap: {"#RAND_INT": [0, 10000]},
    aaaaq: {"#RAND_INT": [0, 10000]},
    aaaar: {"#RAND_INT": [0, 10000]},
    aaaas: {"#RAND_INT": [0, 10000]},
    aaaat: {"#RAND_INT": [0, 10000]},
    aaaau: {"#RAND_INT": [0, 10000]},
    aaaav: {"#RAND_INT": [0, 10000]},
    aaaaw: {"#RAND_INT": [0, 10000]},
    aaaax: {"#RAND_INT": [0, 10000]},
    aaaay: {"#RAND_INT": [0, 10000]},
    aaaaz: {"#RAND_INT": [0, 10000]},
    aaaaaa: {"#RAND_INT": [0, 10000]},
    aaaaab: {"#RAND_INT": [0, 10000]},
    aaaaac: {"#RAND_INT": [0, 10000]},
    aaaaad: {"#RAND_INT": [0, 10000]},
    aaaaae: {"#RAND_INT": [0, 10000]},
    aaaaaf: {"#RAND_INT": [0, 10000]},
    aaaaag: {"#RAND_INT": [0, 10000]},
    aaaaah: {"#RAND_INT": [0, 10000]},
    aaaaai: {"#RAND_INT": [0, 10000]},
    aaaaaj: {"#RAND_INT": [0, 10000]},
    aaaaak: {"#RAND_INT": [0, 10000]},
    aaaaal: {"#RAND_INT": [0, 10000]},
    aaaaam: {"#RAND_INT": [0, 10000]},
    aaaaan: {"#RAND_INT": [0, 10000]},
    aaaaao: {"#RAND_INT": [0, 10000]},
    aaaaap: {"#RAND_INT": [0, 10000]},
    aaaaaq: {"#RAND_INT": [0, 10000]},
    aaaaar: {"#RAND_INT": [0, 10000]},
    aaaaas: {"#RAND_INT": [0, 10000]},
    aaaaat: {"#RAND_INT": [0, 10000]},
};
validator = {
    $and: [
        {a: {$exists: true}},      {a: {$type: 16}},          {b: {$exists: true}},
        {b: {$type: 16}},          {c: {$exists: true}},      {c: {$type: 16}},
        {d: {$exists: true}},      {d: {$type: 16}},          {e: {$exists: true}},
        {e: {$type: 16}},          {f: {$exists: true}},      {f: {$type: 16}},
        {g: {$exists: true}},      {g: {$type: 16}},          {h: {$exists: true}},
        {h: {$type: 16}},          {i: {$exists: true}},      {i: {$type: 16}},
        {j: {$exists: true}},      {j: {$type: 16}},          {k: {$exists: true}},
        {k: {$type: 16}},          {l: {$exists: true}},      {l: {$type: 16}},
        {m: {$exists: true}},      {m: {$type: 16}},          {n: {$exists: true}},
        {n: {$type: 16}},          {o: {$exists: true}},      {o: {$type: 16}},
        {p: {$exists: true}},      {p: {$type: 16}},          {q: {$exists: true}},
        {q: {$type: 16}},          {r: {$exists: true}},      {r: {$type: 16}},
        {s: {$exists: true}},      {s: {$type: 16}},          {t: {$exists: true}},
        {t: {$type: 16}},          {u: {$exists: true}},      {u: {$type: 16}},
        {v: {$exists: true}},      {v: {$type: 16}},          {w: {$exists: true}},
        {w: {$type: 16}},          {x: {$exists: true}},      {x: {$type: 16}},
        {y: {$exists: true}},      {y: {$type: 16}},          {z: {$exists: true}},
        {z: {$type: 16}},          {aa: {$exists: true}},     {aa: {$type: 16}},
        {ab: {$exists: true}},     {ab: {$type: 16}},         {ac: {$exists: true}},
        {ac: {$type: 16}},         {ad: {$exists: true}},     {ad: {$type: 16}},
        {ae: {$exists: true}},     {ae: {$type: 16}},         {af: {$exists: true}},
        {af: {$type: 16}},         {ag: {$exists: true}},     {ag: {$type: 16}},
        {ah: {$exists: true}},     {ah: {$type: 16}},         {ai: {$exists: true}},
        {ai: {$type: 16}},         {aj: {$exists: true}},     {aj: {$type: 16}},
        {ak: {$exists: true}},     {ak: {$type: 16}},         {al: {$exists: true}},
        {al: {$type: 16}},         {am: {$exists: true}},     {am: {$type: 16}},
        {an: {$exists: true}},     {an: {$type: 16}},         {ao: {$exists: true}},
        {ao: {$type: 16}},         {ap: {$exists: true}},     {ap: {$type: 16}},
        {aq: {$exists: true}},     {aq: {$type: 16}},         {ar: {$exists: true}},
        {ar: {$type: 16}},         {as: {$exists: true}},     {as: {$type: 16}},
        {at: {$exists: true}},     {at: {$type: 16}},         {au: {$exists: true}},
        {au: {$type: 16}},         {av: {$exists: true}},     {av: {$type: 16}},
        {aw: {$exists: true}},     {aw: {$type: 16}},         {ax: {$exists: true}},
        {ax: {$type: 16}},         {ay: {$exists: true}},     {ay: {$type: 16}},
        {az: {$exists: true}},     {az: {$type: 16}},         {aaa: {$exists: true}},
        {aaa: {$type: 16}},        {aab: {$exists: true}},    {aab: {$type: 16}},
        {aac: {$exists: true}},    {aac: {$type: 16}},        {aad: {$exists: true}},
        {aad: {$type: 16}},        {aae: {$exists: true}},    {aae: {$type: 16}},
        {aaf: {$exists: true}},    {aaf: {$type: 16}},        {aag: {$exists: true}},
        {aag: {$type: 16}},        {aah: {$exists: true}},    {aah: {$type: 16}},
        {aai: {$exists: true}},    {aai: {$type: 16}},        {aaj: {$exists: true}},
        {aaj: {$type: 16}},        {aak: {$exists: true}},    {aak: {$type: 16}},
        {aal: {$exists: true}},    {aal: {$type: 16}},        {aam: {$exists: true}},
        {aam: {$type: 16}},        {aan: {$exists: true}},    {aan: {$type: 16}},
        {aao: {$exists: true}},    {aao: {$type: 16}},        {aap: {$exists: true}},
        {aap: {$type: 16}},        {aaq: {$exists: true}},    {aaq: {$type: 16}},
        {aar: {$exists: true}},    {aar: {$type: 16}},        {aas: {$exists: true}},
        {aas: {$type: 16}},        {aat: {$exists: true}},    {aat: {$type: 16}},
        {aau: {$exists: true}},    {aau: {$type: 16}},        {aav: {$exists: true}},
        {aav: {$type: 16}},        {aaw: {$exists: true}},    {aaw: {$type: 16}},
        {aax: {$exists: true}},    {aax: {$type: 16}},        {aay: {$exists: true}},
        {aay: {$type: 16}},        {aaz: {$exists: true}},    {aaz: {$type: 16}},
        {aaaa: {$exists: true}},   {aaaa: {$type: 16}},       {aaab: {$exists: true}},
        {aaab: {$type: 16}},       {aaac: {$exists: true}},   {aaac: {$type: 16}},
        {aaad: {$exists: true}},   {aaad: {$type: 16}},       {aaae: {$exists: true}},
        {aaae: {$type: 16}},       {aaaf: {$exists: true}},   {aaaf: {$type: 16}},
        {aaag: {$exists: true}},   {aaag: {$type: 16}},       {aaah: {$exists: true}},
        {aaah: {$type: 16}},       {aaai: {$exists: true}},   {aaai: {$type: 16}},
        {aaaj: {$exists: true}},   {aaaj: {$type: 16}},       {aaak: {$exists: true}},
        {aaak: {$type: 16}},       {aaal: {$exists: true}},   {aaal: {$type: 16}},
        {aaam: {$exists: true}},   {aaam: {$type: 16}},       {aaan: {$exists: true}},
        {aaan: {$type: 16}},       {aaao: {$exists: true}},   {aaao: {$type: 16}},
        {aaap: {$exists: true}},   {aaap: {$type: 16}},       {aaaq: {$exists: true}},
        {aaaq: {$type: 16}},       {aaar: {$exists: true}},   {aaar: {$type: 16}},
        {aaas: {$exists: true}},   {aaas: {$type: 16}},       {aaat: {$exists: true}},
        {aaat: {$type: 16}},       {aaau: {$exists: true}},   {aaau: {$type: 16}},
        {aaav: {$exists: true}},   {aaav: {$type: 16}},       {aaaw: {$exists: true}},
        {aaaw: {$type: 16}},       {aaax: {$exists: true}},   {aaax: {$type: 16}},
        {aaay: {$exists: true}},   {aaay: {$type: 16}},       {aaaz: {$exists: true}},
        {aaaz: {$type: 16}},       {aaaaa: {$exists: true}},  {aaaaa: {$type: 16}},
        {aaaab: {$exists: true}},  {aaaab: {$type: 16}},      {aaaac: {$exists: true}},
        {aaaac: {$type: 16}},      {aaaad: {$exists: true}},  {aaaad: {$type: 16}},
        {aaaae: {$exists: true}},  {aaaae: {$type: 16}},      {aaaaf: {$exists: true}},
        {aaaaf: {$type: 16}},      {aaaag: {$exists: true}},  {aaaag: {$type: 16}},
        {aaaah: {$exists: true}},  {aaaah: {$type: 16}},      {aaaai: {$exists: true}},
        {aaaai: {$type: 16}},      {aaaaj: {$exists: true}},  {aaaaj: {$type: 16}},
        {aaaak: {$exists: true}},  {aaaak: {$type: 16}},      {aaaal: {$exists: true}},
        {aaaal: {$type: 16}},      {aaaam: {$exists: true}},  {aaaam: {$type: 16}},
        {aaaan: {$exists: true}},  {aaaan: {$type: 16}},      {aaaao: {$exists: true}},
        {aaaao: {$type: 16}},      {aaaap: {$exists: true}},  {aaaap: {$type: 16}},
        {aaaaq: {$exists: true}},  {aaaaq: {$type: 16}},      {aaaar: {$exists: true}},
        {aaaar: {$type: 16}},      {aaaas: {$exists: true}},  {aaaas: {$type: 16}},
        {aaaat: {$exists: true}},  {aaaat: {$type: 16}},      {aaaau: {$exists: true}},
        {aaaau: {$type: 16}},      {aaaav: {$exists: true}},  {aaaav: {$type: 16}},
        {aaaaw: {$exists: true}},  {aaaaw: {$type: 16}},      {aaaax: {$exists: true}},
        {aaaax: {$type: 16}},      {aaaay: {$exists: true}},  {aaaay: {$type: 16}},
        {aaaaz: {$exists: true}},  {aaaaz: {$type: 16}},      {aaaaaa: {$exists: true}},
        {aaaaaa: {$type: 16}},     {aaaaab: {$exists: true}}, {aaaaab: {$type: 16}},
        {aaaaac: {$exists: true}}, {aaaaac: {$type: 16}},     {aaaaad: {$exists: true}},
        {aaaaad: {$type: 16}},     {aaaaae: {$exists: true}}, {aaaaae: {$type: 16}},
        {aaaaaf: {$exists: true}}, {aaaaaf: {$type: 16}},     {aaaaag: {$exists: true}},
        {aaaaag: {$type: 16}},     {aaaaah: {$exists: true}}, {aaaaah: {$type: 16}},
        {aaaaai: {$exists: true}}, {aaaaai: {$type: 16}},     {aaaaaj: {$exists: true}},
        {aaaaaj: {$type: 16}},     {aaaaak: {$exists: true}}, {aaaaak: {$type: 16}},
        {aaaaal: {$exists: true}}, {aaaaal: {$type: 16}},     {aaaaam: {$exists: true}},
        {aaaaam: {$type: 16}},     {aaaaan: {$exists: true}}, {aaaaan: {$type: 16}},
        {aaaaao: {$exists: true}}, {aaaaao: {$type: 16}},     {aaaaap: {$exists: true}},
        {aaaaap: {$type: 16}},     {aaaaaq: {$exists: true}}, {aaaaaq: {$type: 16}},
        {aaaaar: {$exists: true}}, {aaaaar: {$type: 16}},     {aaaaas: {$exists: true}},
        {aaaaas: {$type: 16}},     {aaaaat: {$exists: true}}, {aaaaat: {$type: 16}},
    ]
};
jsonSchema = {
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
        u: {bsonType: "int"},
        v: {bsonType: "int"},
        w: {bsonType: "int"},
        x: {bsonType: "int"},
        y: {bsonType: "int"},
        z: {bsonType: "int"},
        aa: {bsonType: "int"},
        ab: {bsonType: "int"},
        ac: {bsonType: "int"},
        ad: {bsonType: "int"},
        ae: {bsonType: "int"},
        af: {bsonType: "int"},
        ag: {bsonType: "int"},
        ah: {bsonType: "int"},
        ai: {bsonType: "int"},
        aj: {bsonType: "int"},
        ak: {bsonType: "int"},
        al: {bsonType: "int"},
        am: {bsonType: "int"},
        an: {bsonType: "int"},
        ao: {bsonType: "int"},
        ap: {bsonType: "int"},
        aq: {bsonType: "int"},
        ar: {bsonType: "int"},
        as: {bsonType: "int"},
        at: {bsonType: "int"},
        au: {bsonType: "int"},
        av: {bsonType: "int"},
        aw: {bsonType: "int"},
        ax: {bsonType: "int"},
        ay: {bsonType: "int"},
        az: {bsonType: "int"},
        aaa: {bsonType: "int"},
        aab: {bsonType: "int"},
        aac: {bsonType: "int"},
        aad: {bsonType: "int"},
        aae: {bsonType: "int"},
        aaf: {bsonType: "int"},
        aag: {bsonType: "int"},
        aah: {bsonType: "int"},
        aai: {bsonType: "int"},
        aaj: {bsonType: "int"},
        aak: {bsonType: "int"},
        aal: {bsonType: "int"},
        aam: {bsonType: "int"},
        aan: {bsonType: "int"},
        aao: {bsonType: "int"},
        aap: {bsonType: "int"},
        aaq: {bsonType: "int"},
        aar: {bsonType: "int"},
        aas: {bsonType: "int"},
        aat: {bsonType: "int"},
        aau: {bsonType: "int"},
        aav: {bsonType: "int"},
        aaw: {bsonType: "int"},
        aax: {bsonType: "int"},
        aay: {bsonType: "int"},
        aaz: {bsonType: "int"},
        aaaa: {bsonType: "int"},
        aaab: {bsonType: "int"},
        aaac: {bsonType: "int"},
        aaad: {bsonType: "int"},
        aaae: {bsonType: "int"},
        aaaf: {bsonType: "int"},
        aaag: {bsonType: "int"},
        aaah: {bsonType: "int"},
        aaai: {bsonType: "int"},
        aaaj: {bsonType: "int"},
        aaak: {bsonType: "int"},
        aaal: {bsonType: "int"},
        aaam: {bsonType: "int"},
        aaan: {bsonType: "int"},
        aaao: {bsonType: "int"},
        aaap: {bsonType: "int"},
        aaaq: {bsonType: "int"},
        aaar: {bsonType: "int"},
        aaas: {bsonType: "int"},
        aaat: {bsonType: "int"},
        aaau: {bsonType: "int"},
        aaav: {bsonType: "int"},
        aaaw: {bsonType: "int"},
        aaax: {bsonType: "int"},
        aaay: {bsonType: "int"},
        aaaz: {bsonType: "int"},
        aaaaa: {bsonType: "int"},
        aaaab: {bsonType: "int"},
        aaaac: {bsonType: "int"},
        aaaad: {bsonType: "int"},
        aaaae: {bsonType: "int"},
        aaaaf: {bsonType: "int"},
        aaaag: {bsonType: "int"},
        aaaah: {bsonType: "int"},
        aaaai: {bsonType: "int"},
        aaaaj: {bsonType: "int"},
        aaaak: {bsonType: "int"},
        aaaal: {bsonType: "int"},
        aaaam: {bsonType: "int"},
        aaaan: {bsonType: "int"},
        aaaao: {bsonType: "int"},
        aaaap: {bsonType: "int"},
        aaaaq: {bsonType: "int"},
        aaaar: {bsonType: "int"},
        aaaas: {bsonType: "int"},
        aaaat: {bsonType: "int"},
        aaaau: {bsonType: "int"},
        aaaav: {bsonType: "int"},
        aaaaw: {bsonType: "int"},
        aaaax: {bsonType: "int"},
        aaaay: {bsonType: "int"},
        aaaaz: {bsonType: "int"},
        aaaaaa: {bsonType: "int"},
        aaaaab: {bsonType: "int"},
        aaaaac: {bsonType: "int"},
        aaaaad: {bsonType: "int"},
        aaaaae: {bsonType: "int"},
        aaaaaf: {bsonType: "int"},
        aaaaag: {bsonType: "int"},
        aaaaah: {bsonType: "int"},
        aaaaai: {bsonType: "int"},
        aaaaaj: {bsonType: "int"},
        aaaaak: {bsonType: "int"},
        aaaaal: {bsonType: "int"},
        aaaaam: {bsonType: "int"},
        aaaaan: {bsonType: "int"},
        aaaaao: {bsonType: "int"},
        aaaaap: {bsonType: "int"},
        aaaaaq: {bsonType: "int"},
        aaaaar: {bsonType: "int"},
        aaaaas: {bsonType: "int"},
        aaaaat: {bsonType: "int"},
    },
    required: [
        "a",      "b",      "c",      "d",      "e",      "f",      "g",      "h",      "i",
        "j",      "k",      "l",      "m",      "n",      "o",      "p",      "q",      "r",
        "s",      "t",      "u",      "v",      "w",      "x",      "y",      "z",      "aa",
        "ab",     "ac",     "ad",     "ae",     "af",     "ag",     "ah",     "ai",     "aj",
        "ak",     "al",     "am",     "an",     "ao",     "ap",     "aq",     "ar",     "as",
        "at",     "au",     "av",     "aw",     "ax",     "ay",     "az",     "aaa",    "aab",
        "aac",    "aad",    "aae",    "aaf",    "aag",    "aah",    "aai",    "aaj",    "aak",
        "aal",    "aam",    "aan",    "aao",    "aap",    "aaq",    "aar",    "aas",    "aat",
        "aau",    "aav",    "aaw",    "aax",    "aay",    "aaz",    "aaaa",   "aaab",   "aaac",
        "aaad",   "aaae",   "aaaf",   "aaag",   "aaah",   "aaai",   "aaaj",   "aaak",   "aaal",
        "aaam",   "aaan",   "aaao",   "aaap",   "aaaq",   "aaar",   "aaas",   "aaat",   "aaau",
        "aaav",   "aaaw",   "aaax",   "aaay",   "aaaz",   "aaaaa",  "aaaab",  "aaaac",  "aaaad",
        "aaaae",  "aaaaf",  "aaaag",  "aaaah",  "aaaai",  "aaaaj",  "aaaak",  "aaaal",  "aaaam",
        "aaaan",  "aaaao",  "aaaap",  "aaaaq",  "aaaar",  "aaaas",  "aaaat",  "aaaau",  "aaaav",
        "aaaaw",  "aaaax",  "aaaay",  "aaaaz",  "aaaaaa", "aaaaab", "aaaaac", "aaaaad", "aaaaae",
        "aaaaaf", "aaaaag", "aaaaah", "aaaaai", "aaaaaj", "aaaaak", "aaaaal", "aaaaam", "aaaaan",
        "aaaaao", "aaaaap", "aaaaaq", "aaaaar", "aaaaas", "aaaaat",
    ]
};
createDocValidationTest("Insert.DocValidation.OneFiftyInt", doc, validator, jsonSchema);

/**
 * Tests a JSON Schema that enforces a variety of constraints on twenty fields (not including the
 * _id).
 */
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
validator = undefined;
jsonSchema = {
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
};
createDocValidationTest("Insert.DocValidation.Variety", doc, validator, jsonSchema);

/**
 * Tests a JSON Schema that enforces constraints on an array containing thirty items.
 */
doc = {
    a: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco",
        "laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
        "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla",
        "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa",
        "qui officia deserunt mollit anim id est laborum",
        {b: 0, c: 0},
        {b: 1, c: 1},
        {b: 2, c: 2},
        {b: 3, c: 3},
        {b: 4, c: 4},
        {b: 5, c: 5},
        {b: 6, c: 6},
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        [229, "West 43rd Street"],
        ["1-2-1", "銀座"],
        [29, "Rue Montmartre"],
        ["Maximilianstraße", 7],
        [70, "Comunipaw Avenue"],
        ["Prinzregentenstraße", 9],
        [120, "Ocean Avenue"],
        ["1-9-1", "丸の内"],
        [1600, "Pennsylvania Avenue"],
    ]
};
validator = undefined;
jsonSchema = {
    properties: {
        a: {
            type: ["array"],
            uniqueItems: true,
            minItems: 10,
            maxItems: 30,
            items: [
                {enum: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]},
                {type: "string"},
                {type: ["string"]},
                {type: "string"},
                {minLength: 5},
                {maxLength: 90},
                {pattern: "[a-zA-Z .,]+"},
                {type: "object"},
                {minProperties: 1},
                {maxProperties: 3},
                {properties: {b: {type: "number"}}},
                {patternProperties: {c: {type: "number"}}},
                {required: ["b", "c"]},
                {properties: {b: {}, c: {}}, additionalProperties: false},
                {type: "number"},
                {type: ["number"]},
                {bsonType: "number"},
                {bsonType: ["int", "long", "number"]},
                {minimum: 0},
                {maximum: 10},
                {multipleOf: 2}
            ],
            additionalItems: {
                type: "array",
                oneOf: [
                    {items: [{type: "number"}, {type: "string"}]},
                    {items: [{type: "string"}, {type: "number"}]},
                    {items: [{type: "string"}, {type: "string"}]}
                ]
            }
        }
    },
    required: ["a"]
};
createDocValidationTest("Insert.DocValidation.Array", doc, validator, jsonSchema);

/**
 * Tests a JSON Schema that enforces constraints on a document nested thirty levels deep.
 */
doc = {
 a: {
  b: {
   c: {
    d: {
     e: {
      f: {
       g: {
        h: {
         i: {
          j: {
           k: {
            l: {
             m: {
              n: {
               o: {
                p: {
                 q: {
                  r: {
                   s: {
                    t: {
                     q: {
                      r: {
                       s: {
                        t: {
                         u: {
                          v: {
                           w: {
                            x: {
                             y: {
                              z: {
                               aa: {
                                ab: {
                                 ac: {
                                  ad: {
                                   sku: "123",
                                   price: 3.14,
                                   country: "fr",
                                   stock: 1000,
                                   name: "widget"
                                  }
                                 }
                                }
                               }
                              }
                             }
                            }
                           }
                          }
                         }
                        }
                       }
                      }
                     }
                    }
                   }
                  }
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 }
};
validator = undefined;
jsonSchema = {
 properties: {
  a: {
   type: "object",
   properties: {
    b: {
     type: "object",
     properties: {
      c: {
       type: "object",
       properties: {
        d: {
         type: "object",
         properties: {
          e: {
           type: "object",
           properties: {
            f: {
             type: "object",
             properties: {
              g: {
               type: "object",
               properties: {
                h: {
                 type: "object",
                 properties: {
                  i: {
                   type: "object",
                   properties: {
                    j: {
                     type: "object",
                     properties: {
                      k: {
                       type: "object",
                       properties: {
                        l: {
                         type: "object",
                         properties: {
                          m: {
                           type: "object",
                           properties: {
                            n: {
                             type: "object",
                             properties: {
                              o: {
                               type: "object",
                               properties: {
                                p: {
                                 type: "object",
                                 properties: {
                                  q: {
                                   type: "object",
                                   properties: {
                                    r: {
                                     type: "object",
                                     properties: {
                                      s: {
                                       type: "object",
                                       properties: {
                                        t: {
                                         type: "object",
                                         properties: {
                                          u: {
                                           type: "object",
                                           properties: {
                                            v: {
                                             type: "object",
                                             properties: {
                                              w: {
                                               type: "object",
                                               properties: {
                                                x: {
                                                 type: "object",
                                                 properties: {
                                                  y: {
                                                   type: "object",
                                                   properties: {
                                                    z: {
                                                     type: "object",
                                                     properties: {
                                                      aa: {
                                                       type: "object",
                                                       properties: {
                                                        ab: {
                                                         type: "object",
                                                         properties: {
                                                          ac: {
                                                           type: "object",
                                                           properties: {
                                                            ad: {
                                                             type: "object",
                                                             properties: {
                                                              sku: {type: "number"},
                                                              price: {
                                                               type: "number",
                                                               minimum: 0,
                                                               maximum: 10.0
                                                              },
                                                              country: {enum: ["fr", "es"]},
                                                              stock: {
                                                               type: "number",
                                                               minimum: 0,
                                                               multipleOf: 1
                                                              },
                                                              name: {
                                                               type: "string"
                                                              }
                                                             }
                                                            }
                                                           }
                                                          }
                                                         }
                                                        }
                                                       }
                                                      }
                                                     }
                                                    }
                                                   }
                                                  }
                                                 }
                                                }
                                               }
                                              }
                                             }
                                            }
                                           }
                                          }
                                         }
                                        }
                                       }
                                      }
                                     }
                                    }
                                   }
                                  }
                                 }
                                }
                               }
                              }
                             }
                            }
                           }
                          }
                         }
                        }
                       }
                      }
                     }
                    }
                   }
                  }
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 }
};
createDocValidationTest("Insert.DocValidation.Nested", doc, validator, jsonSchema);
