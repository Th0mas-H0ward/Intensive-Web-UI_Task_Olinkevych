Не проходили тести на Moodle. Після заповнення форми відповіді та натискання кнопки "check", я отримував наступне: 
"try {

let berry = new Berry("Cranberry", "red");

console.log(Berry info: ${berry});

berry = new Berry("Blueberry", "blue", "C");

console.log(Berry info: ${berry});

berry = new Berry("Strawberry ", "red", "A", "B", "C");

console.log(Berry info: ${berry});

} catch (e) {

console.log(Error while running the test case: ${e});

}

Berry info: Berry(name='Cranberry', color='red', vitamins=[])

Berry info: Berry(name='Blueberry', color='blue', vitamins=["C"])

Berry info: Berry(name='Strawberry
...
"

На цьому вивід обривався. Приймати код, який не задовільняв тести, форма відмовлялася, в результаті чого отримав нульовий бал.