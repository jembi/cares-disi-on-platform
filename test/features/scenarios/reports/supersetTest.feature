Feature: CHART TEST
    Scenario: TEST
        And I check Superset for chart data using the following
            | field | value |
            | ID    | 17    |

        Then there should be a result identified by "obs.diagnostic_pcr_test_result" of "2838"

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 10    |

        Then there should be a result identified by "p.patient_key_population" of "PWUD" with the following fields and values
            | field | value |
            | count | 150   |

        Then there should be a result identified by "p.patient_key_population" of "MSW" with the following fields and values
            | field | value |
            | count | 134   |
