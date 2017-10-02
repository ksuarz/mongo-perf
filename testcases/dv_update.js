if (typeof(tests) != "object") {
    tests = [];
}

/**
 * Creates a document validation update performance test named 'name'. During setup, it populates a
 * collection by obtaining documents from 'generator'. It then tests the overhead of executing
 * 'update' in the collection with a validator 'validator' or 'jsonSchema', compared to a baseline
 * where no validator is present.
 *
 * If both 'validator' and 'jsonSchema' are specified, the two should be semantically equivalent,
 * such that the test compares the performance of JSON Schema against normal MongoDB match
 * expressions.
 */
function createDocValidationTest(name, generator, update, validator, jsonSchema) {
    var baseTags = ["update", "DocValidation"];
    var numDocs = 4800;
    var query = {_id: {"#RAND_INT_PLUS_THREAD": [0, 100]}};
    var populate = function(collection) {
        var bulk = collection.initializeUnorderedBulkOp();
        for (var i = 0; i < numDocs; ++i) {
            bulk.insert(generator(i));
        }
        assert.writeOK(bulk.execute());
    };

    // Add a baseline test that performs 'update' in a collection with no validator.
    tests.push({
        name: name + ".Compare",
        tags: ["compare"].concat(baseTags),
        pre: function(collection) {
            collection.drop();
            populate(collection);
        },
        ops: [{op: "update", query: query, update: update}]
    });

    // Add a test that performs 'update' in a collection with validator 'validator'.
    if (validator !== undefined) {
        tests.push({
            name: name,
            tags: ["regression"].concat(baseTags),
            pre: function(collection) {
                collection.drop();
                assert.commandWorked(collection.runCommand("create", {validator: validator}));
                populate(collection);
            },
            ops: [{op: "update", query: query, update: update}]
        });
    }

    // Add a test that performs 'update' in a collection with validator 'jsonSchema'.
    if (jsonSchema !== undefined) {
        tests.push({
            name: name + ".JSONSchema",
            tags: ["regression", "jsonschema"].concat(baseTags),
            pre: function(collection) {
                collection.drop();
                assert.commandWorked(
                    collection.runCommand("create", {validator: {$jsonSchema: jsonSchema}}));
                populate(collection);
            },
            ops: [{op: "update", query: query, update: update}]
        });
    }
}

/**
 * Tests updating documents with a field which must exist and be a double. This targets the use of
 * $type and $exists on a single field. Also generates a comparison JSON Schema test.
 */
var generator = function(i) {
    return {_id: i, a: 0};
};
var update = {$inc: {a: 1}};
var validator = {$and: [{a: {$exists: true}}, {a: {$type: 1}}]};
var jsonSchema = {properties: {a: {bsonType: "double"}}, required: ["a"]};
createDocValidationTest("Update.DocValidation.OneNum", generator, update, validator, jsonSchema);

/**
 * Like the "OneNum" test, but validates that ten fields exist and are doubles.
 */
generator = function(i) {
    return {_id: i, a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0};
};
update = {
    $inc: {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1}
};
validator = {
    $and: [
        {a: {$exists: true}}, {a: {$type: 1}}, {b: {$exists: true}}, {b: {$type: 1}},
        {c: {$exists: true}}, {c: {$type: 1}}, {d: {$exists: true}}, {d: {$type: 1}},
        {e: {$exists: true}}, {e: {$type: 1}}, {f: {$exists: true}}, {f: {$type: 1}},
        {g: {$exists: true}}, {g: {$type: 1}}, {h: {$exists: true}}, {h: {$type: 1}},
        {i: {$exists: true}}, {i: {$type: 1}}, {j: {$exists: true}}, {j: {$type: 1}},
    ]
};
createDocValidationTest("Update.DocValidation.TenNum", generator, update, validator);

/**
 * Like the "OneNum" test, but validates that twenty fields exist and are doubles. Also generates a
 * comparison JSON Schema test.
 */
generator = function(i) {
    return {
        _id: i,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        o: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0
    };
};
update = {
    $inc: {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
        g: 1,
        h: 1,
        i: 1,
        j: 1,
        k: 1,
        l: 1,
        m: 1,
        n: 1,
        o: 1,
        p: 1,
        q: 1,
        r: 1,
        s: 1,
        t: 1
    }
};
validator = {
    $and: [
        {a: {$exists: true}}, {a: {$type: 1}}, {b: {$exists: true}}, {b: {$type: 1}},
        {c: {$exists: true}}, {c: {$type: 1}}, {d: {$exists: true}}, {d: {$type: 1}},
        {e: {$exists: true}}, {e: {$type: 1}}, {f: {$exists: true}}, {f: {$type: 1}},
        {g: {$exists: true}}, {g: {$type: 1}}, {h: {$exists: true}}, {h: {$type: 1}},
        {i: {$exists: true}}, {i: {$type: 1}}, {j: {$exists: true}}, {j: {$type: 1}},
        {k: {$exists: true}}, {k: {$type: 1}}, {l: {$exists: true}}, {l: {$type: 1}},
        {m: {$exists: true}}, {m: {$type: 1}}, {n: {$exists: true}}, {n: {$type: 1}},
        {o: {$exists: true}}, {o: {$type: 1}}, {p: {$exists: true}}, {p: {$type: 1}},
        {q: {$exists: true}}, {q: {$type: 1}}, {r: {$exists: true}}, {r: {$type: 1}},
        {s: {$exists: true}}, {s: {$type: 1}}, {t: {$exists: true}}, {t: {$type: 1}},
    ]
};
jsonSchema = {
    properties: {
        a: {bsonType: "double"},
        b: {bsonType: "double"},
        c: {bsonType: "double"},
        d: {bsonType: "double"},
        e: {bsonType: "double"},
        f: {bsonType: "double"},
        g: {bsonType: "double"},
        h: {bsonType: "double"},
        i: {bsonType: "double"},
        j: {bsonType: "double"},
        k: {bsonType: "double"},
        l: {bsonType: "double"},
        m: {bsonType: "double"},
        n: {bsonType: "double"},
        o: {bsonType: "double"},
        p: {bsonType: "double"},
        q: {bsonType: "double"},
        r: {bsonType: "double"},
        s: {bsonType: "double"},
        t: {bsonType: "double"},
    },
    required: [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"
    ]
};
createDocValidationTest("Update.DocValidation.TwentyNum", generator, update, validator, jsonSchema);

/**
 * Like the "OneNum" test, but validates that twenty fields exist and are doubles. Also generates a
 * comparison JSON Schema test.
 */
generator = function(i) {
    return {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        o: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0,
        u: 0,
        v: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
        aa: 0,
        ab: 0,
        ac: 0,
        ad: 0,
        ae: 0,
        af: 0,
        ag: 0,
        ah: 0,
        ai: 0,
        aj: 0,
        ak: 0,
        al: 0,
        am: 0,
        an: 0,
        ao: 0,
        ap: 0,
        aq: 0,
        ar: 0,
        as: 0,
        at: 0,
        au: 0,
        av: 0,
        aw: 0,
        ax: 0,
        ay: 0,
        az: 0,
        aaa: 0,
        aab: 0,
        aac: 0,
        aad: 0,
        aae: 0,
        aaf: 0,
        aag: 0,
        aah: 0,
        aai: 0,
        aaj: 0,
        aak: 0,
        aal: 0,
        aam: 0,
        aan: 0,
        aao: 0,
        aap: 0,
        aaq: 0,
        aar: 0,
        aas: 0,
        aat: 0,
        aau: 0,
        aav: 0,
        aaw: 0,
        aax: 0,
        aay: 0,
        aaz: 0,
        aaaa: 0,
        aaab: 0,
        aaac: 0,
        aaad: 0,
        aaae: 0,
        aaaf: 0,
        aaag: 0,
        aaah: 0,
        aaai: 0,
        aaaj: 0,
        aaak: 0,
        aaal: 0,
        aaam: 0,
        aaan: 0,
        aaao: 0,
        aaap: 0,
        aaaq: 0,
        aaar: 0,
        aaas: 0,
        aaat: 0,
        aaau: 0,
        aaav: 0,
        aaaw: 0,
        aaax: 0,
        aaay: 0,
        aaaz: 0,
        aaaaa: 0,
        aaaab: 0,
        aaaac: 0,
        aaaad: 0,
        aaaae: 0,
        aaaaf: 0,
        aaaag: 0,
        aaaah: 0,
        aaaai: 0,
        aaaaj: 0,
        aaaak: 0,
        aaaal: 0,
        aaaam: 0,
        aaaan: 0,
        aaaao: 0,
        aaaap: 0,
        aaaaq: 0,
        aaaar: 0,
        aaaas: 0,
        aaaat: 0,
        aaaau: 0,
        aaaav: 0,
        aaaaw: 0,
        aaaax: 0,
        aaaay: 0,
        aaaaz: 0,
        aaaaaa: 0,
        aaaaab: 0,
        aaaaac: 0,
        aaaaad: 0,
        aaaaae: 0,
        aaaaaf: 0,
        aaaaag: 0,
        aaaaah: 0,
        aaaaai: 0,
        aaaaaj: 0,
        aaaaak: 0,
        aaaaal: 0,
        aaaaam: 0,
        aaaaan: 0,
        aaaaao: 0,
        aaaaap: 0,
        aaaaaq: 0,
        aaaaar: 0,
        aaaaas: 0,
        aaaaat: 0,
    };
};
update = {
    $inc: {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
        g: 1,
        h: 1,
        i: 1,
        j: 1,
        k: 1,
        l: 1,
        m: 1,
        n: 1,
        o: 1,
        p: 1,
        q: 1,
        r: 1,
        s: 1,
        t: 1,
        u: 1,
        v: 1,
        w: 1,
        x: 1,
        y: 1,
        z: 1,
        aa: 1,
        ab: 1,
        ac: 1,
        ad: 1,
        ae: 1,
        af: 1,
        ag: 1,
        ah: 1,
        ai: 1,
        aj: 1,
        ak: 1,
        al: 1,
        am: 1,
        an: 1,
        ao: 1,
        ap: 1,
        aq: 1,
        ar: 1,
        as: 1,
        at: 1,
        au: 1,
        av: 1,
        aw: 1,
        ax: 1,
        ay: 1,
        az: 1,
        aaa: 1,
        aab: 1,
        aac: 1,
        aad: 1,
        aae: 1,
        aaf: 1,
        aag: 1,
        aah: 1,
        aai: 1,
        aaj: 1,
        aak: 1,
        aal: 1,
        aam: 1,
        aan: 1,
        aao: 1,
        aap: 1,
        aaq: 1,
        aar: 1,
        aas: 1,
        aat: 1,
        aau: 1,
        aav: 1,
        aaw: 1,
        aax: 1,
        aay: 1,
        aaz: 1,
        aaaa: 1,
        aaab: 1,
        aaac: 1,
        aaad: 1,
        aaae: 1,
        aaaf: 1,
        aaag: 1,
        aaah: 1,
        aaai: 1,
        aaaj: 1,
        aaak: 1,
        aaal: 1,
        aaam: 1,
        aaan: 1,
        aaao: 1,
        aaap: 1,
        aaaq: 1,
        aaar: 1,
        aaas: 1,
        aaat: 1,
        aaau: 1,
        aaav: 1,
        aaaw: 1,
        aaax: 1,
        aaay: 1,
        aaaz: 1,
        aaaaa: 1,
        aaaab: 1,
        aaaac: 1,
        aaaad: 1,
        aaaae: 1,
        aaaaf: 1,
        aaaag: 1,
        aaaah: 1,
        aaaai: 1,
        aaaaj: 1,
        aaaak: 1,
        aaaal: 1,
        aaaam: 1,
        aaaan: 1,
        aaaao: 1,
        aaaap: 1,
        aaaaq: 1,
        aaaar: 1,
        aaaas: 1,
        aaaat: 1,
        aaaau: 1,
        aaaav: 1,
        aaaaw: 1,
        aaaax: 1,
        aaaay: 1,
        aaaaz: 1,
        aaaaaa: 1,
        aaaaab: 1,
        aaaaac: 1,
        aaaaad: 1,
        aaaaae: 1,
        aaaaaf: 1,
        aaaaag: 1,
        aaaaah: 1,
        aaaaai: 1,
        aaaaaj: 1,
        aaaaak: 1,
        aaaaal: 1,
        aaaaam: 1,
        aaaaan: 1,
        aaaaao: 1,
        aaaaap: 1,
        aaaaaq: 1,
        aaaaar: 1,
        aaaaas: 1,
        aaaaat: 1,
    }
};
validator = {
    $and: [
        {a: {$exists: true}},      {a: {$type: 1}},           {b: {$exists: true}},
        {b: {$type: 1}},           {c: {$exists: true}},      {c: {$type: 1}},
        {d: {$exists: true}},      {d: {$type: 1}},           {e: {$exists: true}},
        {e: {$type: 1}},           {f: {$exists: true}},      {f: {$type: 1}},
        {g: {$exists: true}},      {g: {$type: 1}},           {h: {$exists: true}},
        {h: {$type: 1}},           {i: {$exists: true}},      {i: {$type: 1}},
        {j: {$exists: true}},      {j: {$type: 1}},           {k: {$exists: true}},
        {k: {$type: 1}},           {l: {$exists: true}},      {l: {$type: 1}},
        {m: {$exists: true}},      {m: {$type: 1}},           {n: {$exists: true}},
        {n: {$type: 1}},           {o: {$exists: true}},      {o: {$type: 1}},
        {p: {$exists: true}},      {p: {$type: 1}},           {q: {$exists: true}},
        {q: {$type: 1}},           {r: {$exists: true}},      {r: {$type: 1}},
        {s: {$exists: true}},      {s: {$type: 1}},           {t: {$exists: true}},
        {t: {$type: 1}},           {u: {$exists: true}},      {u: {$type: 1}},
        {v: {$exists: true}},      {v: {$type: 1}},           {w: {$exists: true}},
        {w: {$type: 1}},           {x: {$exists: true}},      {x: {$type: 1}},
        {y: {$exists: true}},      {y: {$type: 1}},           {z: {$exists: true}},
        {z: {$type: 1}},           {aa: {$exists: true}},     {aa: {$type: 1}},
        {ab: {$exists: true}},     {ab: {$type: 1}},          {ac: {$exists: true}},
        {ac: {$type: 1}},          {ad: {$exists: true}},     {ad: {$type: 1}},
        {ae: {$exists: true}},     {ae: {$type: 1}},          {af: {$exists: true}},
        {af: {$type: 1}},          {ag: {$exists: true}},     {ag: {$type: 1}},
        {ah: {$exists: true}},     {ah: {$type: 1}},          {ai: {$exists: true}},
        {ai: {$type: 1}},          {aj: {$exists: true}},     {aj: {$type: 1}},
        {ak: {$exists: true}},     {ak: {$type: 1}},          {al: {$exists: true}},
        {al: {$type: 1}},          {am: {$exists: true}},     {am: {$type: 1}},
        {an: {$exists: true}},     {an: {$type: 1}},          {ao: {$exists: true}},
        {ao: {$type: 1}},          {ap: {$exists: true}},     {ap: {$type: 1}},
        {aq: {$exists: true}},     {aq: {$type: 1}},          {ar: {$exists: true}},
        {ar: {$type: 1}},          {as: {$exists: true}},     {as: {$type: 1}},
        {at: {$exists: true}},     {at: {$type: 1}},          {au: {$exists: true}},
        {au: {$type: 1}},          {av: {$exists: true}},     {av: {$type: 1}},
        {aw: {$exists: true}},     {aw: {$type: 1}},          {ax: {$exists: true}},
        {ax: {$type: 1}},          {ay: {$exists: true}},     {ay: {$type: 1}},
        {az: {$exists: true}},     {az: {$type: 1}},          {aaa: {$exists: true}},
        {aaa: {$type: 1}},         {aab: {$exists: true}},    {aab: {$type: 1}},
        {aac: {$exists: true}},    {aac: {$type: 1}},         {aad: {$exists: true}},
        {aad: {$type: 1}},         {aae: {$exists: true}},    {aae: {$type: 1}},
        {aaf: {$exists: true}},    {aaf: {$type: 1}},         {aag: {$exists: true}},
        {aag: {$type: 1}},         {aah: {$exists: true}},    {aah: {$type: 1}},
        {aai: {$exists: true}},    {aai: {$type: 1}},         {aaj: {$exists: true}},
        {aaj: {$type: 1}},         {aak: {$exists: true}},    {aak: {$type: 1}},
        {aal: {$exists: true}},    {aal: {$type: 1}},         {aam: {$exists: true}},
        {aam: {$type: 1}},         {aan: {$exists: true}},    {aan: {$type: 1}},
        {aao: {$exists: true}},    {aao: {$type: 1}},         {aap: {$exists: true}},
        {aap: {$type: 1}},         {aaq: {$exists: true}},    {aaq: {$type: 1}},
        {aar: {$exists: true}},    {aar: {$type: 1}},         {aas: {$exists: true}},
        {aas: {$type: 1}},         {aat: {$exists: true}},    {aat: {$type: 1}},
        {aau: {$exists: true}},    {aau: {$type: 1}},         {aav: {$exists: true}},
        {aav: {$type: 1}},         {aaw: {$exists: true}},    {aaw: {$type: 1}},
        {aax: {$exists: true}},    {aax: {$type: 1}},         {aay: {$exists: true}},
        {aay: {$type: 1}},         {aaz: {$exists: true}},    {aaz: {$type: 1}},
        {aaaa: {$exists: true}},   {aaaa: {$type: 1}},        {aaab: {$exists: true}},
        {aaab: {$type: 1}},        {aaac: {$exists: true}},   {aaac: {$type: 1}},
        {aaad: {$exists: true}},   {aaad: {$type: 1}},        {aaae: {$exists: true}},
        {aaae: {$type: 1}},        {aaaf: {$exists: true}},   {aaaf: {$type: 1}},
        {aaag: {$exists: true}},   {aaag: {$type: 1}},        {aaah: {$exists: true}},
        {aaah: {$type: 1}},        {aaai: {$exists: true}},   {aaai: {$type: 1}},
        {aaaj: {$exists: true}},   {aaaj: {$type: 1}},        {aaak: {$exists: true}},
        {aaak: {$type: 1}},        {aaal: {$exists: true}},   {aaal: {$type: 1}},
        {aaam: {$exists: true}},   {aaam: {$type: 1}},        {aaan: {$exists: true}},
        {aaan: {$type: 1}},        {aaao: {$exists: true}},   {aaao: {$type: 1}},
        {aaap: {$exists: true}},   {aaap: {$type: 1}},        {aaaq: {$exists: true}},
        {aaaq: {$type: 1}},        {aaar: {$exists: true}},   {aaar: {$type: 1}},
        {aaas: {$exists: true}},   {aaas: {$type: 1}},        {aaat: {$exists: true}},
        {aaat: {$type: 1}},        {aaau: {$exists: true}},   {aaau: {$type: 1}},
        {aaav: {$exists: true}},   {aaav: {$type: 1}},        {aaaw: {$exists: true}},
        {aaaw: {$type: 1}},        {aaax: {$exists: true}},   {aaax: {$type: 1}},
        {aaay: {$exists: true}},   {aaay: {$type: 1}},        {aaaz: {$exists: true}},
        {aaaz: {$type: 1}},        {aaaaa: {$exists: true}},  {aaaaa: {$type: 1}},
        {aaaab: {$exists: true}},  {aaaab: {$type: 1}},       {aaaac: {$exists: true}},
        {aaaac: {$type: 1}},       {aaaad: {$exists: true}},  {aaaad: {$type: 1}},
        {aaaae: {$exists: true}},  {aaaae: {$type: 1}},       {aaaaf: {$exists: true}},
        {aaaaf: {$type: 1}},       {aaaag: {$exists: true}},  {aaaag: {$type: 1}},
        {aaaah: {$exists: true}},  {aaaah: {$type: 1}},       {aaaai: {$exists: true}},
        {aaaai: {$type: 1}},       {aaaaj: {$exists: true}},  {aaaaj: {$type: 1}},
        {aaaak: {$exists: true}},  {aaaak: {$type: 1}},       {aaaal: {$exists: true}},
        {aaaal: {$type: 1}},       {aaaam: {$exists: true}},  {aaaam: {$type: 1}},
        {aaaan: {$exists: true}},  {aaaan: {$type: 1}},       {aaaao: {$exists: true}},
        {aaaao: {$type: 1}},       {aaaap: {$exists: true}},  {aaaap: {$type: 1}},
        {aaaaq: {$exists: true}},  {aaaaq: {$type: 1}},       {aaaar: {$exists: true}},
        {aaaar: {$type: 1}},       {aaaas: {$exists: true}},  {aaaas: {$type: 1}},
        {aaaat: {$exists: true}},  {aaaat: {$type: 1}},       {aaaau: {$exists: true}},
        {aaaau: {$type: 1}},       {aaaav: {$exists: true}},  {aaaav: {$type: 1}},
        {aaaaw: {$exists: true}},  {aaaaw: {$type: 1}},       {aaaax: {$exists: true}},
        {aaaax: {$type: 1}},       {aaaay: {$exists: true}},  {aaaay: {$type: 1}},
        {aaaaz: {$exists: true}},  {aaaaz: {$type: 1}},       {aaaaaa: {$exists: true}},
        {aaaaaa: {$type: 1}},      {aaaaab: {$exists: true}}, {aaaaab: {$type: 1}},
        {aaaaac: {$exists: true}}, {aaaaac: {$type: 1}},      {aaaaad: {$exists: true}},
        {aaaaad: {$type: 1}},      {aaaaae: {$exists: true}}, {aaaaae: {$type: 1}},
        {aaaaaf: {$exists: true}}, {aaaaaf: {$type: 1}},      {aaaaag: {$exists: true}},
        {aaaaag: {$type: 1}},      {aaaaah: {$exists: true}}, {aaaaah: {$type: 1}},
        {aaaaai: {$exists: true}}, {aaaaai: {$type: 1}},      {aaaaaj: {$exists: true}},
        {aaaaaj: {$type: 1}},      {aaaaak: {$exists: true}}, {aaaaak: {$type: 1}},
        {aaaaal: {$exists: true}}, {aaaaal: {$type: 1}},      {aaaaam: {$exists: true}},
        {aaaaam: {$type: 1}},      {aaaaan: {$exists: true}}, {aaaaan: {$type: 1}},
        {aaaaao: {$exists: true}}, {aaaaao: {$type: 1}},      {aaaaap: {$exists: true}},
        {aaaaap: {$type: 1}},      {aaaaaq: {$exists: true}}, {aaaaaq: {$type: 1}},
        {aaaaar: {$exists: true}}, {aaaaar: {$type: 1}},      {aaaaas: {$exists: true}},
        {aaaaas: {$type: 1}},      {aaaaat: {$exists: true}}, {aaaaat: {$type: 1}},
    ]
};
jsonSchema = {
    properties: {
        a: {bsonType: "double"},
        b: {bsonType: "double"},
        c: {bsonType: "double"},
        d: {bsonType: "double"},
        e: {bsonType: "double"},
        f: {bsonType: "double"},
        g: {bsonType: "double"},
        h: {bsonType: "double"},
        i: {bsonType: "double"},
        j: {bsonType: "double"},
        k: {bsonType: "double"},
        l: {bsonType: "double"},
        m: {bsonType: "double"},
        n: {bsonType: "double"},
        o: {bsonType: "double"},
        p: {bsonType: "double"},
        q: {bsonType: "double"},
        r: {bsonType: "double"},
        s: {bsonType: "double"},
        t: {bsonType: "double"},
        u: {bsonType: "double"},
        v: {bsonType: "double"},
        w: {bsonType: "double"},
        x: {bsonType: "double"},
        y: {bsonType: "double"},
        z: {bsonType: "double"},
        aa: {bsonType: "double"},
        ab: {bsonType: "double"},
        ac: {bsonType: "double"},
        ad: {bsonType: "double"},
        ae: {bsonType: "double"},
        af: {bsonType: "double"},
        ag: {bsonType: "double"},
        ah: {bsonType: "double"},
        ai: {bsonType: "double"},
        aj: {bsonType: "double"},
        ak: {bsonType: "double"},
        al: {bsonType: "double"},
        am: {bsonType: "double"},
        an: {bsonType: "double"},
        ao: {bsonType: "double"},
        ap: {bsonType: "double"},
        aq: {bsonType: "double"},
        ar: {bsonType: "double"},
        as: {bsonType: "double"},
        at: {bsonType: "double"},
        au: {bsonType: "double"},
        av: {bsonType: "double"},
        aw: {bsonType: "double"},
        ax: {bsonType: "double"},
        ay: {bsonType: "double"},
        az: {bsonType: "double"},
        aaa: {bsonType: "double"},
        aab: {bsonType: "double"},
        aac: {bsonType: "double"},
        aad: {bsonType: "double"},
        aae: {bsonType: "double"},
        aaf: {bsonType: "double"},
        aag: {bsonType: "double"},
        aah: {bsonType: "double"},
        aai: {bsonType: "double"},
        aaj: {bsonType: "double"},
        aak: {bsonType: "double"},
        aal: {bsonType: "double"},
        aam: {bsonType: "double"},
        aan: {bsonType: "double"},
        aao: {bsonType: "double"},
        aap: {bsonType: "double"},
        aaq: {bsonType: "double"},
        aar: {bsonType: "double"},
        aas: {bsonType: "double"},
        aat: {bsonType: "double"},
        aau: {bsonType: "double"},
        aav: {bsonType: "double"},
        aaw: {bsonType: "double"},
        aax: {bsonType: "double"},
        aay: {bsonType: "double"},
        aaz: {bsonType: "double"},
        aaaa: {bsonType: "double"},
        aaab: {bsonType: "double"},
        aaac: {bsonType: "double"},
        aaad: {bsonType: "double"},
        aaae: {bsonType: "double"},
        aaaf: {bsonType: "double"},
        aaag: {bsonType: "double"},
        aaah: {bsonType: "double"},
        aaai: {bsonType: "double"},
        aaaj: {bsonType: "double"},
        aaak: {bsonType: "double"},
        aaal: {bsonType: "double"},
        aaam: {bsonType: "double"},
        aaan: {bsonType: "double"},
        aaao: {bsonType: "double"},
        aaap: {bsonType: "double"},
        aaaq: {bsonType: "double"},
        aaar: {bsonType: "double"},
        aaas: {bsonType: "double"},
        aaat: {bsonType: "double"},
        aaau: {bsonType: "double"},
        aaav: {bsonType: "double"},
        aaaw: {bsonType: "double"},
        aaax: {bsonType: "double"},
        aaay: {bsonType: "double"},
        aaaz: {bsonType: "double"},
        aaaaa: {bsonType: "double"},
        aaaab: {bsonType: "double"},
        aaaac: {bsonType: "double"},
        aaaad: {bsonType: "double"},
        aaaae: {bsonType: "double"},
        aaaaf: {bsonType: "double"},
        aaaag: {bsonType: "double"},
        aaaah: {bsonType: "double"},
        aaaai: {bsonType: "double"},
        aaaaj: {bsonType: "double"},
        aaaak: {bsonType: "double"},
        aaaal: {bsonType: "double"},
        aaaam: {bsonType: "double"},
        aaaan: {bsonType: "double"},
        aaaao: {bsonType: "double"},
        aaaap: {bsonType: "double"},
        aaaaq: {bsonType: "double"},
        aaaar: {bsonType: "double"},
        aaaas: {bsonType: "double"},
        aaaat: {bsonType: "double"},
        aaaau: {bsonType: "double"},
        aaaav: {bsonType: "double"},
        aaaaw: {bsonType: "double"},
        aaaax: {bsonType: "double"},
        aaaay: {bsonType: "double"},
        aaaaz: {bsonType: "double"},
        aaaaaa: {bsonType: "double"},
        aaaaab: {bsonType: "double"},
        aaaaac: {bsonType: "double"},
        aaaaad: {bsonType: "double"},
        aaaaae: {bsonType: "double"},
        aaaaaf: {bsonType: "double"},
        aaaaag: {bsonType: "double"},
        aaaaah: {bsonType: "double"},
        aaaaai: {bsonType: "double"},
        aaaaaj: {bsonType: "double"},
        aaaaak: {bsonType: "double"},
        aaaaal: {bsonType: "double"},
        aaaaam: {bsonType: "double"},
        aaaaan: {bsonType: "double"},
        aaaaao: {bsonType: "double"},
        aaaaap: {bsonType: "double"},
        aaaaaq: {bsonType: "double"},
        aaaaar: {bsonType: "double"},
        aaaaas: {bsonType: "double"},
        aaaaat: {bsonType: "double"},
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
createDocValidationTest(
    "Update.DocValidation.OneFiftyNum", generator, update, validator, jsonSchema);

/**
 * Tests updates in the face of a JSON Schema validator that enforces a variety of constraints on
 * twenty fields (not including the _id).
 */
generator = function(i) {
    return {
        _id: i,
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
};
update = {
    $inc: {a: 1}
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
createDocValidationTest("Update.DocValidation.Variety", generator, update, validator, jsonSchema);

/**
 * Tests a JSON Schema that enforces constraints on an array containing thirty items.
 */
generator = function(i) {
    return {
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
};
update = {
    $inc: {"a.14": 1}
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
createDocValidationTest("Update.DocValidation.Array", generator, update, validator, jsonSchema);

/**
 * Tests a JSON Schema that enforces constraints on a document nested thirty levels deep.
 */
generator = function(i) {
 return {
  _id: i,
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
};
update = {
 $inc: {
  "a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.aa.ab.ac.ad.price": 1,
  "a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.aa.ab.ac.ad.stock": 1
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
createDocValidationTest("Update.DocValidation.Nested", generator, update, validator, jsonSchema);
