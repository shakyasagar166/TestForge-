from app.testing.assertions import AssertionEvaluator


def test_json_path_extraction():
    data = {
        "user": {
            "profile": {
                "name": "Alex",
                "settings": {"notifications": True}
            },
            "roles": ["tester", "developer"]
        }
    }

    assert AssertionEvaluator._extract_json_path(data, "user.profile.name") == "Alex"
    assert AssertionEvaluator._extract_json_path(data, "user.profile.settings.notifications") is True
    assert AssertionEvaluator._extract_json_path(data, "user.roles.0") == "tester"
    assert AssertionEvaluator._extract_json_path(data, "non_existent.path") is None
