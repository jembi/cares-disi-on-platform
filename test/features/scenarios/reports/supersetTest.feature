Feature: CHART TEST
    Scenario: TEST
        And I check Superset for chart data using the following
            | field | value |
            | ID    | 1     |

        Then there should be a result identified by "obs.diagnostic_pcr_test_result" of "1662"

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 12    |

        Then there should be a result identified by "f.city" of "Report 3A City" with the following fields and values
            | field | value |
            | count | 552   |

        Then there should be a result identified by "f.city" of "Report 1A City" with the following fields and values
            | field | value |
            | count | 473   |
