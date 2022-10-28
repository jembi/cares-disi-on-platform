Feature: CHART TEST
    Scenario: TEST

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 1     |

        Then there should be a count of "123"

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 2     |

        Then there should be a result identified by "PWID" with the following fields and values
            | field | value |
            | count | 14    |

        Then there should be a result identified by "MSW" with the following fields and values
            | field | value |
            | count | 23    |
