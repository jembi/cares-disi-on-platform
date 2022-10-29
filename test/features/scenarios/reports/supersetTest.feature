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

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 6     |

        Then there should be a result identified by "1-4" of "unknown" with the following fields and values
            | field | value |
            | count | 1     |

        Then there should be a result identified by "1-4" of "male" with the following fields and values
            | field | value |
            | count | 3     |

        Then there should be a result identified by "15-19" of "female" with the following fields and values
            | field | value |
            | count | 1     |

        And I check Superset for chart data using the following
            | field | value |
            | ID    | 7     |

        Then there should be a result identified by "1-4" of "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay" with the following fields and values
            | field | value |
            | count | 2     |

        Then there should be a result identified by "1-4" of "SARS-CoV-2 (COVID-19) RNA [Cycle Threshold #] in Respiratory specimen by NAA with probe detection" with the following fields and values
            | field | value |
            | count | 6     |

        Then there should be a result identified by "15-19" of "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay" with the following fields and values
            | field | value |
            | count | 5     |
