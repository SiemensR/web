
Andy Carter

    BlogCodeAbout

A Beginners Guide to the Task Runner Gulp

You’ve possibly heard of the task runner Grunt. If you’ve not used it it’s basically a tool for automating tasks like minification, compilation, unit testing, etc.. However, a newer task runner has emerged and is picking up speed, Gulp.
What is a Task Runner

Why would you want to use a task runner? Well they’re small applications that automate often time consuming and boring tasks. If you ever need to do any of the following then a task runner is for you:-

    Minification and concatenation of JavaScript and CSS files
    CSS Preprocessing
    Image optimisation
    Unit testing and linting

By creating a task file you can instruct the task manager to take care of many development tasks and watch for changes in relevant files. All you’ll need to do is start up the task runner and get to work on the more interesting parts of your project.
Gulp vs. Grunt

Unlike Grunt which is all about configuration files, Gulp is about streams and code-over-configuration. That might sound off putting to some, but bear with me.

Like Grunt, Gulp uses Node, but you don’t need to know Node to use it. Some basic JavaScript knowledge will help, but is not essential as using Gulp is really simple.

The advantage of Gulp’s code-over-configuration approach is that you end up with a cleaner and easier to read task file with greater consistency between tasks. Each Grunt task can be considerably different in setup.

Gulp uses streams which I won’t go into here, but this is a good resource if you’re interested. The advantage of streams is that you put a file into the stream and get one out; there’s no need for temporary files and folders like with Grunt. The flow is easier to read from the code too.

One other advantage of Gulp over Grunt is that Gulp plugins are kept simple. They are designed to do one thing and do it well. Gulp simply just applies them. With Grunt you can find yourself running into conflict issues or shared functionality. We’ll take a look at plugins in a bit.
Let’s Get Started and Install Gulp

As mentioned earlier Gulp uses Node, so if you haven’t already got it you’ll need to install it. You can get it from the Node website, just hit the big install button and follow the instructions. If you’re not sure if you’ve got Node installed open up a terminal and run the command:-

node -v

If you get something like ‘command not found’ you’ll need to install it.

Next you’ll need to globally install Gulp using the Node Package Manager (npm) from the terminal:-

npm install -g gulp

If you’re running this from OSX or Linux you’ll probably need to run this as an administrator so prepend it with sudo.

Gulp is now installed globally, but will need installing locally on a project before you can use it.
Add Gulp to a Project

From the terminal navigate to the project folder you want to use Gulp on; something like:-

cd ~/projects/my-project

From now on all the commands you’ll be running will be from the project’s root folder. The project needs a file called package.json. So create one in the project’s folder, the contents of the file should be something like:-

{
  "name": "my-project",
  "version": "0.1.0",
  "devDependencies": {
  }
}

Alternatively you could generate the file by running npm init. It’s up to you which method you prefer.

Now install Gulp locally:-

npm install gulp --save-dev

The --save-dev flag will automatically add Gulp to the depenencies of your package.json file. You should see a new line like:-

"gulp": "~3.5.2"

The number might be a bit different, but that shouldn’t matter. That just states which version of Gulp is required. You should also see a new folder in your project called node_modules (check using ls or dir if you’re using Windows).

You need to create one more file in the project’s folder called gulpfile.js (from now on refered to as just the gulpfile). This file will contain the instructions for what you want Gulp to actually do. For now we’ll just include Gulp:-

// Include gulp
var gulp = require('gulp');

We’ll add some tasks to this file in a moment, but first it is perhaps worth just quickly introducing the four Gulp methods that we will be using:-

    gulp.task(name, fn) – registers a function with a name
    gulp.watch(glob, fn) – runs a function when a file that matches the glob changes
    gulp.src(glob) – returns a readable stream
    gulp.dest(folder) – returns a writable stream

Don’t worry if that doesn’t mean much to you yet. All will hopefully start to make sense when we start putting Gulp into action…
Concatenating Files with Gulp

Gulp on its own doesn’t do a lot. We need to install plugins and add tasks to the gulpfile to put Gulp into action. To concatenate files we’ll need the gulp-concat plugin; to install it run this from the command line:-

npm install gulp-concat --save-dev

Again, if you check your package.json file you should see a new line referencing the newly installed plugin:-

"gulp-concat": "~2.1.7"

Now we need to add a task to the gulpfile that will instruct Gulp to concatenate some files. Let’s concatenate the project’s JavaScript files:-

// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
// Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('build/js'));
});
// Default Task
gulp.task('default', ['scripts']);

What’s happening here is we’re including the gulp-concat plugin and naming it with the variable concat. We then define the task using gulp.task, naming it ‘scripts’. The task involves three processes:-

    We grab the files we want to concatenate using gulp.src (any file with the extension .js in the directory src/js/.
    We then concatenate these files as main.js.
    Finally we tell Gulp where to put main.js, in this case the directory build/js.

The default task tells Gulp what tasks to call when it’s run, for now that’s just the scripts task. To run Gulp just run:-

gulp

Hopefully if everything’s gone right main.js will have been created in build/js and will be a concatenation of all the JS files.

If you need to concatenate files in a particular order, then you can always pass an array to gulp.src. For example:-

gulp.src(['src/js/plugins/*.js', 'src/js/main.js'])

Minify the JavaScript with Gulp

We’re now going to minify the concatenated JavaScript file. Again we need to:-

    Install a plugin
    Add/Modify a task to gulpfile

Minifying in Gulp is done using gulp-uglify; install it and another plugin called gulp-rename using NPM:-

npm install gulp-uglify gulp-rename --save-dev

That should have installed both plugins and added them to package.json. We’re now going to modify the scripts task so that we minify the JavaScript file from before:-

// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});
// Default Task
gulp.task('default', ['scripts']);

Our scripts task now concatenates the JavaScript files as main.js, renames the file main.min.js using the gulp-rename plugin and then minifies it using uglify. The final file is output to build/js.

Run Gulp again and you should find the minified JavaScript:-

gulp

Reducing the number of assets a browser needs to download to a single small sized file will instantly improve a site’s performance thanks to Gulp.
Preprocess CSS with Gulp

Now it’s time to add a new task for compiling Sass files into regular CSS.

There is a gulp-sass plugin that uses the Node version of Sass, but we’ll use the official Ruby Sass plugin (gulp-ruby-sass) as it’s more stable and feature rich:-

npm install --save-dev gulp-ruby-sass

You will need to have Ruby and Sass installed to use this plugin, but if you’re already using Sass you’ve probably already got them.

Now in the gulpfile add a new task (updated 28/04/2015):-

var sass = require('gulp-ruby-sass');
gulp.task('sass', function() {
    return sass('src/scss/style.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

This task will take the style.scss file (and any Sass partials imported into it), compile it to minified CSS (using Sass’s in-built compression), rename it style.min.scss and output the final file to build/css.

Before we can run the task we need to add it to Gulp’s default tasks:-

// Default Task
gulp.task('default', ['scripts', 'sass']);

Run gulp and you’ll find it not only generates the concatenated, minified JavaScript file, but also compiles the Sass file:-

gulp

If Less CSS is more your thing there’s a plugin for that too.
Image Optimisation with Gulp

Hopefully, you should be getting the hang of how things work with Gulp by now. It can do more than work with scripts and stylesheets. Let’s now optimise some images using the gulp-imagemin and gulp-cache plugins. I’ll leave it up to you to install these using NPM. It’s just the same process as before.

We need to add another new task to our gulpfile:-

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/img'));
});

This takes any images in our defined source and compresses them using the gulp-imagemin plugin. We’ve wrapped it in the gulp-cache plugin which will ensure only new or changed images get compressed. Again to make sure this task runs when we run Gulp it needs adding to the default task list:-

// Default Task
gulp.task('default', ['scripts', 'sass', 'images']);

Watching for Changes

This is all very useful, but at the moment we’re needing to run Gulp each time we make a change to a file, which isn’t all that clever. The good news is that Gulp can watch for changes and automatically run the tasks.

Unlike Grunt, Gulp can do this out-of-the-box. So this time there’s no need to install a plugin.

Add the watch task:-

gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
});

Add make sure Gulp runs this by default:-

// Default Task
gulp.task('default', ['scripts', 'sass', 'images', 'watch']);

This time when you run gulp it will keep running and watching for changes in the src/js, src/sass and src/images folders and run the scripts, sass and images tasks when a change is detected in their respective folder.
Finally

Let’s pull all this together and look at the complete gulpfile:-

// Include gulp
var gulp = require('gulp');
// Define base folders
var src = 'src/';
var dest = 'build/';
// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(src + 'js/*.js')
      .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(dest + 'js'));
});
// Compile CSS from Sass files
gulp.task('sass', function() {
    return sass('src/scss/style.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});
gulp.task('images', function() {
  return gulp.src(src + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dest + 'img'));
});
// Watch for changes in files
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch(src + 'js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch(src + 'scss/*.scss', ['sass']);
  // Watch image files
  gulp.watch(src + 'images/**/*', ['images']);
});
// Default Task
gulp.task('default', ['scripts', 'sass', 'images', 'watch']);

A couple of small changes have been made to the gulpfile to show how use can use JavaScript variables to define the source and destination folders used across the script. This should make it easier to maintain.

Just run gulp on the command line and all the tasks should start running. Another neat feature of Gulp is that we can run specific tasks just by passing the task name as a parameter when calling Gulp from the terminal. For example, to just compile the CSS you can run the sass task from above as:-

gulp sass

This means we can also define tasks not called by the default task and just call them when needed.
Some Other Useful Plugins

There are hundreds of plugins available for Gulp already, so there’s much more to explore and discover what Gulp can do for you. Here’s just a handful of useful plugins we didn’t get chance to look at:-

    gulp-jshint – JSLint
    gulp-less – Less CSS preprocessor
    gulp-strip-debug – strips console and debugger statements from JavaScript code
    gulp-todo – generates a todo file for any todo and fixme references in JavaScript code

Oh, and if you’ve got here wondering whether you should use Gulp over Grunt but can’t find an equivalent Gulp plugin that you can get for Grunt there’s a plugin for that: gulp-grunt.

Happy task running!

    Web development Gulp

Related Content

    Fat bankers, nimble workers, smart customers - an MVC analogy
    Automatically Load Gulp Plugins with gulp-load-plugins

Published on Sunday 2 March 2014

Comments

    nikoskip | 17 April 2014 #

    Hey, great article. It’s a cool start point for using gulp.js

    Thanks!
    Jonas | 8 May 2014 #

    Thank you Andy for this very well written tutorial! This now was my starting point for swichting from grunt to gulp :)
    Jee | 30 July 2014 #

    This helped me tremendously. Thank you
    HARISH V | 13 August 2014 #

    Hi, i am trying to combine multiple SCSS files to single CSS like how you have done with js. After i followed all the steps i am getting

    C:\Users\harish\Desktop\MyWork>gulp
    ‘gulp’ is not recognized as an internal or external command,
    operable program or batch file.

    -Contents of gulpfile.js

    // Include gulp
    var gulp = require(‘gulp’); // Include plugins
    var concat = require(‘gulp-concat’); // Concatenate JS Files
    gulp.task(‘scripts’, function() { return gulp.src(‘stylesheet/*.scss’) .pipe(concat(‘main.js’)) .pipe(gulp.dest(‘dest/css’));
    }); // Default Task
    gulp.task(‘default’, [‘scripts’]);

    -Contents of package.json

    { “name”: “MyWork”, “version”: “0.0.0”, “description”: “”, “main”: “grunt.js”, “scripts”: { “test”: “echo \“Error: no test specified\” && exit 1” }, “author”: “”, “license”: “ISC”, “devDependencies”: { “gulp”: “^3.8.7”, “gulp-concat”: “^2.3.4” }
    }

    I want to know what went wrong or is this not the right way?
    Please help !!!!!!
    Andy | 13 August 2014 #

    Hi Harish,

    Your Gulp file looks fine. Although you might want to tidy it up a bit so that it’s clearer that you’re working with CSS and not JS. For example:-

    // Include gulp
    var gulp = require(‘gulp’); // Include plugins
    var concat = require(‘gulp-concat’); // Concatenate Files gulp.task(‘css’, function() { return gulp.src(‘stylesheet/*.scss’ .pipe(concat(‘main.css’)) .pipe(gulp.dest(‘dest/css’));
    });
    // Default Task
    gulp.task(‘default’, [‘css’]);

    Are you sure you have Gulp installed?

    Make sure you globally install Gulp (“npm install -g gulp”) and then from your project’s root directory (where your Gulp and package.json files are) run “npm update” that should install anything missing in the package.json file. Then try again.
    Peter Drinnan | 5 January 2015 #

    Google’s Angular team has switched from Grunt to Gulp. Gulp is definitely the best way forward, but reading the old documentation you will still see Grunt code examples. Hopefully users won’t think that Grunt is still the tool of choice at Google.
    khairold | 9 January 2015 #

    This is brilliant. I’m new at this and most tutorials would assume that you already know stuff. So I appreciate the way this guide being laid out.
    Keith | 28 January 2015 #

    Does anyone else get a

    “TypeError: Arguments to path.join must be strings”

    when executing the styles task?

    The errors aren’t too friendly, but it looks to me like the problem is with the gulp-ruby-sass section, but I’m completely new at this. I’ll paste the complete error at the end of the message.

    I started off customizing your code quite a bit, but I’m basically now just copying and pasting what was provided, but I’m still getting the same error.

    I’ve Googled for answers, but as of yet I’ve come up dry.

    Any ideas on what might cause this?

    Starting ‘styles’…
    ‘styles’ errored after 2.97 ms
    TypeError: Arguments to path.join must be strings at f (path.js:204:15) at Object.filter (native) at Object.exports.join (path.js:209:40) at module.exports (C:\…MyProject\App_Themes\FMHAgentTheme\node_modules\gulp
    -ruby-sass\index.js:61:15) at Gulp.gulp.task.gulp.src.pipe.imagemin.optimizationLevel (C:\…MyProject\App_Themes\FMHAgentTheme\gulpfile.js:25:15) at module.exports (C:\…MyProject\App_Themes\FMHAgentTheme\node_modules\gulp
    \node_modules\orchestrator\lib\runTask.js:34:7) at Gulp.Orchestrator.runTask (C:\…MyProject\App_Themes\FMHAgentTheme\node
    modules\gulp\node_modules\orchestrator\index.js:273:3) at Gulp.Orchestrator.runStep (C:\…MyProject\App_Themes\FMHAgentTheme\node
    modules\gulp\node_modules\orchestrator\index.js:214:10) at Gulp.Orchestrator.start (C:\…MyProject\App_Themes\FMHAgentTheme\node_mod
    ules\gulp\node_modules\orchestrator\index.js:134:8) at C:\Users\keithf\AppData\Roaming\npm\node_modules\gulp\bin\gulp.js:129:20 at process._tickCallback (node.js:415:13) at Function.Module.runMain (module.js:499:11) at startup (node.js:119:16) at node.js:902:3
    Keith | 28 January 2015 #

    Upon further testing, this is the line that is causing the error, but I still don’t see a problem.

    .pipe(sass({style: ‘compressed’}))

    Any help is appreciated.
    Andy | 28 January 2015 #

    Hi Keith, this looks like it should be correct. This is one of the correct options for gulp-ruby-sass. Does it work if you don’t pass any options to sass:-

    .pipe(sass())

    If it does, you could always minify the CSS afterwards using gulp-uglify (like shown above for JS). Not ideal, but would fix your issue.
    Keith | 28 January 2015 #

    Thanks for the response Andy,

    I did try passing it nothing and I get the same error. So I’ve tried reinstalling everything from scratch, but following each step to the letter and I’m still getting this error.

    Could this be a version problem with sass? I’m running 3.4.10. I’m guessing most people should be on that version.
    damian | 11 March 2015 #

    Hi, I finally solved the issue described above by install sass:
    “sudo gem install sass”

    Afterwards you just need:
    gulp.task(‘sass’, function() { return sass(src + ‘scss/style.scss’) .pipe(rename({suffix: ‘.min’})) .pipe(gulp.dest(dest + ‘css’));
    });

    But at the moment I jave no clue how to integrate the minify-Script into sass! Any ideas?
    Luis | 17 March 2015 #

    Great tutorial. I have been using grunt for all my projects, but I am switching right now. Gulp rocks!
    Fernando | 22 April 2015 #

    @Keith,

    The latest version of gulp-ruby-sass will throw out an error if you use the code form this tutorial.

    The updated syntax is: “return sass(‘src/scss/style.scss’, {style: ‘compressed’}) “

    You can remove the later “.pipe(sass({style:…”

    Source: http://stackoverflow.com/questions/28140012/gulp-typeerror-arguments-to-path-join-must-be-strings

    @Andy

    Maybe it might help create a callout for this update inside the tutorial?

    Great tutorial btw! Very well written.
    George | 24 April 2015 #

    Hi Andy,
    I just wanted to say thanks for writing this up, it is clear and simple, which also makes it rare! Thanks for helping.
    Angad | 27 April 2015 #

    Very well written article – clear and to the point. Thank you
    Treefish | 28 April 2015 #

    Andy,
    Thank you for the great article.
    What is the relationship between ~/projects/my-project and src/ and build/? Do src/ and build/ exist inside my-project folder where the index.html is? Do we need to create the src/ and build/ folders? If the imageSpecific file I want to optimize resides in my-project/views/images/(imageSpecific), do I need to modify gulpfile.js to reflect that?i.e. instead of
    var src = ‘src/’;
    I would instead do
    var src=‘views/images/’?
    Or that when I run gulp images, all images will be automatically optimized?
    Andy | 28 April 2015 #

    @Fernando thanks. I’ve updated the post to reflect the change to the Ruby Sass plugin.
    Adam | 19 May 2015 #

    Honestly, after reading this article and finally get the gulp running AND UNDERSTAND what I just did, I just feel AMAZING!!!!!!!!!!
    I want to cry and cheering inside “I ..finally.. did it!!!”
    TvT o
    Its out of joy of course!

    Can’t thank you much for your article. Very * infinity GREAT!
    Tim | 13 June 2015 #

    Having a problem running gulp command in my project folder, this is the error I get “-bash: gulp: command not found”. Any idea what is wrong? I did the npm update and sudo installed globally. Built my package/gulpfile inside of my project. Im stumped. Please help!
    Andy | 13 June 2015 #

    @Tim not seen this problem before but looks like the issue might relate to the install path of npm: http://stackoverflow.com/questions/25090452/gulp-command-not-found-after-install.
    Tim | 13 June 2015 #

    @Andy, you are the man! Thank you so much, great article!
    Asim | 30 June 2015 #

    Great article indeed!
    Pip | 28 July 2015 #

    Thanks, this was a good start – following from the bower one. I’m up and running in no time :)
    Rahul | 5 August 2015 #

    Nice article for beginners. Thanks..
    Fernando | 29 August 2015 #

    You shouldn’t have to use ‘sudo’ to install any packages using Node (npm). This is explained in the Node.js documentation and also in this video: https://youtu.be/PWJOXv-K7Ik
    JonyGreen | 6 September 2015 #

    i find another free online service to compress js and minify css, so it will reduce the size of web page.
    Barry | 23 September 2015 #

    Thanks so much!!! My second viewing here, and finally got things to work, well explained, easy to follow, thank you :)

    One issue for me, when compiling the sass files, shouldn’t we be outputting a style.min.css and not style.min.scss ?

    Where is the css file?
    raja | 30 September 2015 #

    really nice…..but what about converting html pages to gulp
    Paulo | 3 October 2015 #

    Thanks a million for putting this together! As an old timer sometimes I have trouble keeping up with new stuff and reading the documentation in my non native language wasn’t much of a help.
    John | 1 January 2016 #

    Dear Andy,

    Thank you, thank you, THANK YOU! I was struggling to get gulp working with HTML5BP within the PHPStorm10 IDE and was really discouraged with all the errors I was getting. The explanations and supposed “help files” I found online weren’t helping. YOUR explanation made it much, MUCH clearer. Implemented it step-by-step and IT WORKED! Two days of cursing at my monitor…until I found your fantastic write-up here. Can’t thank you enough, Andy. I not only have my gulpfile.js working…I actually understand what it is doing, why it works, how it works, etc. Your blog post about this was a Godsend for me. Thanks again. And I’m bookmarking your blog for future visits for sure!

    John S.
    Alda | 21 January 2016 #

    I have problem with grunt i have instaled grunt , i have create the file gruntfile when i have done all the configuration of grunt. And in app.js i have require a grunt. but grunt can’t generate the file in dest: i don’t now why.
    Rohit Ghorpade | 28 January 2016 #

    Great article man. Well explained & easy to get. Awesome !!!
    Andrew | 20 February 2016 #

    Awesome guide. Thank you Andy
    Michael Taquia | 10 March 2016 #

    Great man. I have a problem using cache with images , just do not generate anything , when I delete it and use just imagemin all works well.
    Antonio Milo | 11 March 2016 #

    Thank you! Very helpful article.
    Sohan | 6 April 2016 #

    Very useful article to using gulp effectively with any platform like custom html, cms as well.

    Andy great work so far.
    Adam Blodgett | 2 May 2016 #

    This was an incredibly useful and well written tutorial. Thank you for being so explicit about each step. You’ve included the little details that so many writers usually leave out. It got my gulp set up up and running.
    Nitin | 3 May 2016 #

    Nifty little article! let us gulp!

    most of the stuff works

    but I am having issues getting gulp-cache to work.

    what exactly does it cache, and how do we read from cache in a scenario where,

    we need to log cache contents
    Alan | 24 May 2016 #

    Fantastic example, I fully understand Gulp (as a beginner) now.
    ashish | 8 June 2016 #

    Really a helpful article. I am using gulp in every project now days. Its helping alot with babelifying and e6 harmony. I have also wrote an article on the same some one may find it useful
    http://javacourseblog.blogspot.in/2016/06/introduction-of-gulp-for-begginers.html
    Maurice | 25 October 2016 #

    Fantastic and very easy to follow. Great job and many thanks :-)
    shireef | 23 December 2016 #

    Hi Andy,
    I have a question about Gulp not being helpful in saving scripts loading time, even though the JS files have being concatinated and uglified but when i test the site using google timeline i can see the scripts take long to load and not much beter than my original project.

    Here is my gulpfile.js /*************************** *********** Dependencies ********** ***********————*********/
    var gulp = require(‘gulp’); useref = require(‘gulp-useref’); uglify = require(‘gulp-uglify’); cssnano = require(‘gulp-cssnano’); imagemin = require(‘gulp-imagemin’); gulpIf = require(‘gulp-if’); cache = require(‘gulp-cache’); del = require(‘del’); browserSync = require(‘browser-sync’); /*************************** *********** Tasks ********** ***********————*********/

    /* useref */ gulp.task(‘useref’, function(){ return gulp.src([‘app/**/*.html’, ‘!app/lib/**/*.html’]) .pipe(useref()) .pipe(gulpIf(’*.js’,uglify())) .pipe(gulpIf(’*.css’,cssnano())) .pipe(gulp.dest(‘dist’)) });

    /* images */ gulp.task(‘images’, function(){ return gulp.src( [‘app/images/**/*’, ‘app/lib/lightbox/dist/images/*’]) .pipe(cache(imagemin({ interlaced: true }))) .pipe(gulp.dest(‘dist/images’)) });

    /* fonts */ gulp.task(‘fonts’, function(){ return gulp.src( [‘app/fonts/**/*’, ‘app/lib/bootstrap/dist/fonts/**/*’]) .pipe(gulp.dest(‘dist/fonts’)) });

    /* clean */ gulp.task(‘clean’, function() { return del.sync(‘dist’); })

    // Default task gulp.task(‘default’, function() { gulp.start(‘clean’, ‘useref’, ‘images’,‘fonts’); });

    // Build production site /* gulp.task(‘build’, [‘clean’, ‘useref’, ‘images’, ‘fonts’], function (){ console.log(‘Building files’); }); */

    // Watch gulp.task(‘watch’, [‘browser-sync’], function() { // Watch .js files gulp.watch(’{app/src/**/*.js,app/styles/**/*.css,app/**/*.html}’, [‘usref’]); // Watch image files gulp.watch(‘app/images/**/*’, [‘imagemin’]);

    });

    gulp.task(‘browser-sync’, [‘default’], function () { var files = [ ‘app/**/*.html’, ‘app/styles/**/*.css’, ‘app/images/**/*’, ‘app/src/**/*.js’, ‘dist/**/*’ ];

    browserSync.init(files, { server: { baseDir: “dist”, index: “index.html” } }); // Watch any files in dist/, reload on change gulp.watch([‘dist/**’]).on(‘change’, browserSync.reload); });
    Patrick Fiedorowicz | 13 January 2017 #

    Great article, helps a lot for first steps in Gulp.
    Many thanks!
    Abigail Ava | 19 January 2017 #

    Sometimes we get an error when we try to delete a File or a folder for no reason , but of course there is a reason.We have many damage file or blocked files.Do not worry if we want to remove the error files or too long path files from our system,here I suggest a smooth way.So use “Long path tool” software and keep yourself.

Leave a Comment

    Your name
    Your email address
    Your website (Optional)
    Remember
    Your message
    You will need to preview your comment before you can submit it.

© 2017 Andy Carter, Sheffield (UK).
