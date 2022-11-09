Feature: CHART TEST
    Scenario: TEST

        And I set the following Superset dashboard column filters
            | field          | value       |
            | pepfar_quarter | 20 Dec 2020 |

        And I check Superset for chart data using the following
            | field       | value |
            | DashboardID | 1     |
            | ChartID     | 1     |

        Then there should be a superset count of "82"

        And I check Superset for chart data using the following
            | field       | value |
            | DashboardID | 1     |
            | ChartID     | 2     |

        Then there should be a superset result identified by "PWID" with the following fields and values
            | field | value |
            | count | 13    |

        Then there should be a superset result identified by "MSW" with the following fields and values
            | field | value |
            | count | 12    |

        And I check Superset for chart data using the following
            | field       | value |
            | DashboardID | 1     |
            | ChartID     | 6     |

        Then there should be a superset row identified by "1-4" of "male" with the following fields and values
            | field | value |
            | count | 2     |

        Then there should be a superset row identified by "1-4" of "female" with the following fields and values
            | field | value |
            | count | 2     |

        Then there should be a superset row identified by "15-19" of "female" with the following fields and values
            | field | value |
            | count | 1     |

        And I check Superset for chart data using the following
            | field       | value |
            | DashboardID | 1     |
            | ChartID     | 7     |

        Then there should be a superset row identified by "1-4" of "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay" with the following fields and values
            | field | value |
            | count | 1     |

        Then there should be a superset row identified by "1-4" of "SARS-CoV-2 (COVID-19) RNA [Cycle Threshold #] in Respiratory specimen by NAA with probe detection" with the following fields and values
            | field | value |
            | count | 3     |

        Then there should be a superset row identified by "15-19" of "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay" with the following fields and values
            | field | value |
            | count | 4     |

        Then notify browser resources must be terminated after the following test

        And I check Superset for chart data using the following
            | field       | value |
            | DashboardID | 1     |
            | ChartID     | 8     |

        Then there should be a superset result identified by "Report 1A City" with the following fields and values
            | field | value |
            | count | 29    |

        Then there should be a superset result identified by "Report 5A City" with the following fields and values
            | field | value |
            | count | 30    |

        Then there should be a superset result identified by "Report 3A City" with the following fields and values
            | field | value |
            | count | 23    |
