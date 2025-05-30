import os
import sys
import pytest
from pathlib import Path


parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

def run_all_tests():
    """Run all API tests and generate a report"""
    print("🚀 Starting API Test Suite...")
    print("=" * 50)
    
    test_args = [
        "-v",
        "--tb=short",
        "--color=yes",
        f"{Path(__file__).parent}",
    ]
    
    exit_code = pytest.main(test_args)
    
    print("=" * 50)
    if exit_code == 0:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
    
    return exit_code

def run_specific_module(module_name):
    """Run tests for a specific module"""
    test_file = f"test_{module_name}.py"
    test_path = Path(__file__).parent / test_file
    
    if not test_path.exists():
        print(f"❌ Test file {test_file} not found!")
        return 1
    
    print(f"🧪 Running tests for {module_name}...")
    exit_code = pytest.main(["-v", str(test_path)])
    
    if exit_code == 0:
        print(f"✅ {module_name} tests passed!")
    else:
        print(f"❌ {module_name} tests failed!")
    
    return exit_code

if __name__ == "__main__":
    if len(sys.argv) > 1:
        module = sys.argv[1]
        exit_code = run_specific_module(module)
    else:
        exit_code = run_all_tests()
    
    sys.exit(exit_code)