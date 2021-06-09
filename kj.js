// Creates the property adminName on the global scope.
adminName = 'xyz';

// Creates the property empCount on the global scope.
// Since we are using var, this is marked as non-configurable. The same is true of let and const.
var empCount = 43;

EmployeeDetails = {
  name: 'xyz',
  age: 5,
  designation: 'Developer'
};

// adminName is a property of the global scope.
// It can be deleted since it is created without var,
// and is therefore configurable.
delete adminName;       // returns true

// On the contrary, empCount is not configurable
// since var was used.
delete empCount;       // returns false

// delete can be used to remove properties from objects.
delete EmployeeDetails.name; // returns true

// Even when the property does not exist, delete returns "true".
delete EmployeeDetails.salary; // returns true

// delete does not affect built-in static properties.
delete Math.PI; // returns false

// EmployeeDetails is a property of the global scope.
// Since it was defined without "var", it is marked configurable.
delete EmployeeDetails;   // returns true

function f() {
  var z = 44;

  // delete doesn't affect local variable names
  delete z;     // returns false
}
