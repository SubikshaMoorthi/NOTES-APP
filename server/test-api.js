async function testAPI() {
  try {
    console.log('Testing API...');
    const response = await fetch('http://localhost:5000/api/notes');
    const data = await response.json();
    console.log('Success! Response:', data);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testAPI();