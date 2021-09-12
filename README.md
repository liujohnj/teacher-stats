## CovLab Global II: Edutech Hackathon Submission

Video link:  https://youtu.be/aOmsPGH1wjQ

## Installation instructions
In this specific order ... in one terminal, from project folder:
- npm start

In a second terminal:
- cd front-end
- npm start

From a web browser, visit http://localhost:3000

## Inspiration
As both a student and a parent of school-aged children, the new adversities facing the education system in a post-COVID world are glaringly apparent.  The impact is most heavily felt by younger students, especially those in disadvantaged school districts, and those dedicated teachers who instruct them.

Before COVID-19, teachers had enough of a challenge keeping students engaged and interested.  Now, with many classrooms shifting to virtual online environments relying on tools such as Zoom, the physical separation between student and teacher makes this struggle seem insurmountable.

## What it does
_TeacherStats_ is a web-based application that attempts to mitigate the obstacles by providing score-based metrics that teachers can use to measure student engagement against customizable metrics.  It accomplishes this by leveraging Zoom APIs (Application Programming Interfaces) to deliver valuable information to teachers about Zoom classroom meetings.  The present version uses four customizable metrics to score the engagement between student and teacher:
- Zoom meeting attendance rates
- Length of Zoom classroom meetings
- Whether the meeting was autorecorded
- The use of polls during meetings to increase student engagement.

After logging into the _TeacherStats_ application, teachers are prompted to sync with Zoom's database.  (Zoom credentials are never visible to the _TeacherStats_ application, and all authentication and authorization with Zoom's servers is done via Zoom's own OAuth service.) From the _TeacherStats_ dashboard and control panel, teachers can customize benchmarks and settings, assigning relative weights to each of the four parameters described above.  From these customized criteria, a score is calculated and a dynamic chart visually presented to track and score the level of student engagement.  Tracking these metrics provides a valuable reference point teachers can use to ensure that they are doing everything within their power to maximize student engagement in a virtual environment.

## How I built it
I built _TeacherStats_ by learning and using the following technologies, tools, and services:
- MongoDB and Mongoose for the application's database
- Node.js and Express for the back-end server
- Custom APIs built using Axios to connect the front-end and back-end concerns
- Zoom APIs
- React library for the front-end
- Material-UI and CSS for layouts and further user interface customization.

## Challenges I ran into
Besides the obvious challenges in learning the tech stack that was used (which which I had very little true experience), the biggest challenges were related to integrating the _TeacherStats_ application with Zoom's APIs.  Smoothly integrating Zoom's OAuth service presented some difficulties.  Another big hurdle was trying to leverage the limitation imposed on what APIs can be used depending on the level of Zoom subscription.  I was able to lean on multiple APIs to measure the metrics that I did despite operating with my educational Zoom account, which apparently is Pro level but has admin privileges disabled.  (A free basic Zoom plan will not at present fully function with _TeacherStats_.)

## Accomplishments that I'm proud of
I am most proud of the fact that I was able to conceive of an application that potentially can have a real, positive impact on the education system in a post-pandemic world, and then develop this prototype, all within the compressed time frame provided.

## What I learned
The lessons learned are too innumerable to list all here, but if I had to pick one lesson, it's that with enough time, patience, and motivation, there isn't any challenge that can't be overcome.

## What's next for _TeacherStats_
I am going to continue to develop, expand, and improve the application.  (My first step is going to be to clean up the very, very ugly code I whipped together and perform some optimization and refactoring.)  Afterwards, I plan to add the following features:
- Incorporate new metrics, e.g., identifying students with poor attendance in order to give them more attention, determining participation levels in Zoom polls, etc.
- Possibly integrate with learning platforms such as Canvas (using LTI 1.3 integration).
- Deploy live on DigitalOcean using the domain name of www.teacherstats.com, which I already have procured.
