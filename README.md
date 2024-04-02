# Brief Introduction
- This is an app based on vanilla Javascript that can help you test your computer programing knowledge. All questions are from [quizapi.io](https://quizapi.io/)

# The main features I introduced in this version:

### Fetching quizzes data based on the choices user made.
- Users can select quiz category, difficulty, numbers, and quiz tags to get customized quizzes

### Fetching data detection
- The data fetching is not always success. When fetching data fails, a prompt will be added to help the user return to the main page and reselect the quiz type

### Loading page
- Before the async fetch function returns the data, a loading page will be displayed.

### Local Storage
- All your selections data will be stored locally, so, when you open the webpage next time all your data will be loaded automatically.

### Timmer
- I added a timer when user starts answering the questions. The countdown time is generated based on the number of quizzes user selected.
- The most interesting part is when user is ready to make a submission, I'll detect the time left. If the time is greater than 1 minute, user will have a second chance to go back to the quesion page to check all of the answers.

### All of the answers choosen are editable before submission
- Users can use the "previous" and "next" buttons to check previous and next questions. And they can click the answer option again to deselect the answer.
- The text of the buttons will change based on the index of the question. If it is the first question, the "previous" button will change to "Quit", when user click the "Quit" button, it will go back to the home page. If it is the last question, the "next" button will change to "Submit", when uset click the "Submit" button, it will go to the result page.

### Tips on the number of correct answers
- Sometimes, there will be more than one correct answers for a quize.So I'll give users a tip of the correct answers number.

### Grading system
- The color of the score text, the grade text, and the correct answers will change according to the total score user got.

### Answer details display
- I added a answer details page for this site. In this page you can check all the quizzes' correct answers, wrong answers, and the option user choosen.

### Easy access to home page and start a new challenge
- In order to make it easier for users to return to the home page or start a new challenge, I added new challenge and home page buttons on the result page and the answer details page.

# Main challenges I encountered

### Data processing
- The data fetched from the quize API is actually awful. 
- At first, I decided to use the "correct_answer" object as the reference of the correct answer(s), but after a while I found that the data in many quizzes is empty. So I have to switch to use the "correct_answers" object to get the right answer I want. 
- Finally, I created a new quizzes object to store the processed data I needed.

### Correct answers and user choosen answers comparison
- In my custom data, I stored the correct answers and the user choosen answers in different arrays. When I'm trying to compare those 2 arrays with a "if (array_a === array_b)" statement, the result will always be false. By doing some research I found that when I'm using if (array_a === array_b) to compare 2 arrays I'm actually comparing their address which should be always different in my code. 
- Finally I came up with an ideal by sorting the array and use a JSON.stringify() function to convert them into strings, then I can compare their values.

### Timer status management
- I found a way to write timer in W3School website, but I encountered some problems when dealing with time status. When my previous timer did not end and I started a new round of questions, unexpected things happened in the countdown. 
- In the end, I placed the function all for setting the countdown in the async fetching function, and initialized the countdown parameters every time I need to jump into or jump out of the questions page.

### Special character handling in questions and answers
- There are many special character in the questions title and the answers. Like "\x3C" in one javascript related question and the "<img src="" alt="">" string in the HTML related answers. If I take them as a normal string and insert them into the target element the reslut will always not what I want.
- Eventtually, I used regular expression to replace all of those tags with html charactor entities.
