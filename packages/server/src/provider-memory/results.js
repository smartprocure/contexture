import _ from 'lodash/fp.js'

export default {
  result: (
    { pageSize = 10, page = 1, sort, sortField, sortDir = 'desc' },
    search
  ) => ({
    totalRecords: search(_.size),
    results: search(
      _.flow(
        sort
          ? _.orderBy(
              sort.map('field'),
              sort.map(({ desc }) => (desc ? 'desc' : 'asc'))
            )
          : _.orderBy(sortField, sortDir),
        pageSize > 0
          ? _.slice((page - 1) * pageSize, page * pageSize)
          : _.identity
      )
    ),
  }),
}
