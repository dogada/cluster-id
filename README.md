# ScopeId — database cluster friendy id generator with great query isolation

Great replacement for MongoDB's built-in ObjectID or ShortId. 

ScopeId generates ids in url-friendy base64 format and can have length 13 (without scope) or 26 (with scope) base64 symbols.

Generated ids are non-sequential that helps distribute write load across whole database cluster.

Generated ids encode information about generation time, scope/parent context and geo region, so records can be grouped by geo region and scope and in same time can be ordered by creation time.  

In MongoDB's sharded cluster you can avoid broadcast queries during loading a doc by id and still keep related docs in same shard.

ScopeId can be used with any database but it's especially useful for databases that store records in primary key order (MySQl/InnoDB, CockroachDB, RocksDB, LevelDB, etc). In this case related records, for example comments of an blog post, or products of an shop will be stored together in same shard and even in same part of a disk. It's greatly improves query isolation in distributed databases and hence reading performance.

