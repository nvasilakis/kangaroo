log = {
  account: {
    create: "log.account.create" // can have function
  , update: "log.account.update" // that parses date, user properties, security filters, and returns a json object, with comments (which can be used for debugging)
  , deleet: "log.account.delete" // ..like these
           }
}
