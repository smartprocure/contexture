const sequentialResultTest = require('./testUtils').sequentialResultTest

describe('termStatsHits', () => {
  let test = sequentialResultTest([
    {
      aggregations: {
        termsStatsHits: {
          termsStatsHitsStats: {
            buckets: [
              {
                key: 'City of Deerfield',
                doc_count: 50,
                Stats: {
                  count: 6,
                  min: 60,
                  max: 98,
                  avg: 78.5,
                  sum: 471,
                },
                Hits: {
                  hits: {
                    hits: [
                      {
                        _source: {
                          Organization: {
                            LatLong: '34.056237,-118.257362',
                          },
                        },
                      },
                    ],
                  },
                },
                Details: {
                  buckets: [
                    {
                      Hits: {
                        hits: {
                          hits: [
                            {
                              _source: {
                                Organization: {
                                  ID: '80229',
                                },
                                doc_count: 1,
                                key: 'University Of Michigan at Ann Arbor, MI',
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Boca',
                doc_count: 50,
                Stats: {
                  count: 6,
                  min: 60,
                  max: 98,
                  avg: 78.5,
                  sum: 471,
                },
                Hits: {
                  hits: {
                    hits: [
                      {
                        _source: {
                          Organization: {
                            LatLong: '34.056237,-118.257362',
                          },
                        },
                      },
                    ],
                  },
                },
                Details: {
                  buckets: [
                    {
                      Hits: {
                        hits: {
                          hits: [
                            {
                              _source: {
                                Organization: {
                                  ID: '80229',
                                },
                                doc_count: 1,
                                key: 'University Of Michigan at Ann Arbor, MI',
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  ])
  it('should work', () =>
    test(
      {
        key: 'test',
        type: 'termsStatsHits',
        key_field: 'Organization.Name.untouched',
        value_field: 'LineItem.TotalPrice',
        details_key_field: 'Organization.NameState.untouched',
        details_value_field: 'LineItem.UnitPrice',
        include: ['Organization.LatLong'],
        details_size: 1,
        details_include: ['Organization.ID'],
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
            hits: [
              {
                Organization: {
                  LatLong: '34.056237,-118.257362',
                },
              },
            ],
            details: [
              {
                Organization: {
                  ID: '80229',
                },
                doc_count: 1,
                key: 'University Of Michigan at Ann Arbor, MI',
              },
            ],
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
            hits: [
              {
                Organization: {
                  LatLong: '34.056237,-118.257362',
                },
              },
            ],
            details: [
              {
                Organization: {
                  ID: '80229',
                },
                doc_count: 1,
                key: 'University Of Michigan at Ann Arbor, MI',
              },
            ],
          },
        ],
      },
      [
        {
          aggs: {
            termsStatsHitsStats: {
              terms: {
                field: 'Organization.Name.untouched',
                size: 10,
                order: {
                  'Stats.sum': 'desc',
                },
              },
              aggs: {
                Hits: {
                  top_hits: {
                    _source: {
                      include: ['Organization.LatLong'],
                    },
                    size: 1,
                  },
                },
                Stats: {
                  stats: {
                    field: 'LineItem.TotalPrice',
                  },
                },
                Details: {
                  aggs: {
                    Hits: {
                      top_hits: {
                        _source: {
                          include: ['Organization.ID'],
                        },
                        size: 1,
                      },
                    },
                    Stats: {
                      stats: {
                        field: 'LineItem.UnitPrice',
                      },
                    },
                  },
                  terms: {
                    field: 'Organization.NameState.untouched',
                    order: {
                      'Stats.sum': 'desc',
                    },
                    size: 1,
                  },
                },
              },
            },
          },
        },
      ]
    ))
  it('should support a filter', () =>
    test(
      {
        key: 'test',
        type: 'termsStatsHits',
        key_field: 'Organization.Name',
        value_field: 'LineItem.TotalPrice',
        filter: 'city',
        include: ['Organization.LatLong'],
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
            hits: [
              {
                Organization: {
                  LatLong: '34.056237,-118.257362',
                },
              },
            ],
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
            hits: [
              {
                Organization: {
                  LatLong: '34.056237,-118.257362',
                },
              },
            ],
          },
        ],
      },
      [
        {
          aggs: {
            termsStatsHits: {
              filter: {
                bool: {
                  must: [
                    {
                      regexp: {
                        'Organization.Name.untouched': '.*[Cc][Ii][Tt][Yy].*',
                      },
                    },
                  ],
                },
              },
              aggs: {
                termsStatsHitsStats: {
                  terms: {
                    field: 'Organization.Name.untouched',
                    size: 10,
                    order: {
                      'Stats.sum': 'desc',
                    },
                  },
                  aggs: {
                    Hits: {
                      top_hits: {
                        _source: {
                          include: ['Organization.LatLong'],
                        },
                        size: 1,
                      },
                    },
                    Stats: {
                      stats: {
                        field: 'LineItem.TotalPrice',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]
    ))
})
