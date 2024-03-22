# Validate conversion map

- get keys and fields from Profile
  - get all messageKeys
  - get all fields for each message key and attach its corresponding type
  - output an object of type :

````
{
    "messageKey1" : {
        "field1": "type1",
        "field1": "type1",
    },
    "messageKey2" : {
        "field1": "type1",
        "field1": "type1",
    }
}
```
- declare types for conversion map
- get dependency graph out of json
- check for circular deps
````
