var documenterSearchIndex = {"docs":
[{"location":"#Animations.jl-1","page":"Animations.jl","title":"Animations.jl","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"using PyCall\nusing PyPlot # to hide the console output from first use\n# datapath = PyPlot.matplotlib.get_data_path()\n# mplfontpath = joinpath(datapath, \"fonts/ttf\")\n# if !isdir(mplfontpath)\n#     println(\"Creating $mplfontpath\")\n#     mkdir(mplfontpath)\n# else\n#     println(\"$mplfontpath already exists\")\n# end\n#\nfontpath = \"fonts\"\n# for file in readdir(fontpath)\n#     if splitext(file)[2] == \".ttf\"\n#         cp(joinpath(fontpath, file), joinpath(mplfontpath, file), force=true)\n#         println(\"Copied $file to matplotlib font folder.\")\n#     end\n# end\n#\n# println(\"Rebuilding font cache.\")\n\nfont_manager = PyPlot.matplotlib.font_manager\nfont_files = font_manager.findSystemFonts(fontpaths=[fontpath])\nfont_list = font_manager.createFontList(font_files)\npy\"\"\"\nimport matplotlib.font_manager as font_manager\nfont_manager.fontManager.ttflist.extend($font_list)\n\"\"\"\n\n# PyPlot.matplotlib.font_manager._rebuild()\n\nPyPlot.matplotlib.rc_file(\"matplotlibrc\")","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Animations.jl offers an easy way to set up simple animations where multiple keyframes are interpolated between in sequence. You can choose different easing functions or create your own. Keyframe values can be anything that can be linearly interpolated, you can also add your own methods for special types. An easing can have repetitions and delays, so that looping animations are simpler to create.","category":"page"},{"location":"#Animations-1","page":"Animations.jl","title":"Animations","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"An Animation consists of Keyframes that each have a time stamp and a value. That value must be of the same type for all keyframes. For each pair of consecutive keyframes the animation also contains an Easing. This easing determines how values between two keyframes are interpolated over time. You generally don't have to construct keyframes yourself, there are a few constructor functions for Animation that are easier to use.","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Here we create an animation that starts at the value 1 at time t = 0, then goes to to 2 at t = 1, and then 3 at t = 2. Between the first two keyframes we use a sine in / out easing, and between the next two a linear easing.","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"using PyPlot # hide\nusing Animations\nanim = Animation(\n    0, 1.0, # t = 0, value = 1\n    sineio(),\n    1, 2.0,   # t = 1, value = 2\n    linear(),\n    2, 3.0    # t = 2, value = 3\n)\nnothing  # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Because we are just interpolating numbers in most examples here, we can plot them to visualize what the result of the animation is. To get the value of the animation at some time t we use the at() function.","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"ts = 0:0.01:2\nys = at.(anim, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_1.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Another way to write this is with vectors for timestamps and values. (Note that the first version is often easier to understand if you have many timestamps or if the values are longer, so timestamps and values are not visually aligned anymore). Here's an example of the vector syntax:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"anim = Animation(\n    [0, 2, 3],\n    [0.0, 10.0, 20.0],\n    [sineio(), linear()],\n)","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"note: Note\nThe keyframe values are specified as Float64 literals here and not Ints. That is because an Animation{T} always has to return values of type T and if T is Int you get InexactErrors in most cases after interpolation.","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Instead of using at(), you can also get an animation's value for a specific t by calling it:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"value = anim(t)","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"If you use the interleaved syntax from above, you can leave out easings and they will be filled in with the default linear easing, which you can change using the defaulteasing keyword like so:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"anim = Animation(\n    0, 1.0,  # t = 0, value = 1\n    # no easing specified\n    1, 2.0,  # t = 1, value = 2\n    # no easing specified\n    2, 3.0;  # t = 2, value = 3\n    defaulteasing = sineio()\n)","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"If you use the vector syntax, you can simply specify a single easing instead of a vector, and it will be used for all keyframes. This is the equivalent to the previous example in vector syntax:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"anim = Animation(\n    [0, 1, 2],\n    [1.0, 2.0, 3.0],\n    sineio() # note the single easing instead of a vector\n)","category":"page"},{"location":"#Easings-1","page":"Animations.jl","title":"Easings","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Easings determine how keyframes are interpolated between. These are (usually) functions that go from 0 to 1 over the range from 0 to 1, and their curvature decides velocity and acceleration of the animation. There are multiple predefined easing functions, some of which take parameters:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"using PyPlot\nusing Animations\n\nfunction easingplots()\n\n    efuncs = [\n        noease,\n        stepease,\n        linear,\n        sineio,\n        saccadic,\n        expin,\n        expout,\n        polyin,\n        polyout,\n        polyio]\n\n    params = [\n        [nothing],\n        [0.25, 0.5, 0.75],\n        [nothing],\n        [nothing],\n        [1, 2, 4],\n        [0.2, 2, 8],\n        [0.2, 2, 8],\n        [2, 3, 6],\n        [2, 3, 6],\n        [2, 3, 6]]\n\n    n = length(efuncs)\n    cols = 3\n    rows = Int(ceil(n / cols))\n\n    width = 7\n    height = rows * 1.8\n    fig, axes = subplots(rows, cols, figsize=(width, height), constrained_layout=true)\n\n    xx = 0:0.005:1\n\n    for a in axes\n        a.axis(\"off\")\n    end\n\n    for (i, (ef, ps)) in enumerate(zip(efuncs, params))\n\n        a = axes[(divrem(i - 1, cols) .+ (1, 1))...]\n\n        a.plot([-0.25, 0], [0, 0], color=(0.5, 0.5, 0.5), linestyle=\"dotted\")\n        a.plot([1, 1.25], [1, 1], color=(0.5, 0.5, 0.5), linestyle=\"dotted\")\n        a.set_title(\"$(Symbol(ef))\", fontweight=600)\n        for p in ps\n            easing = isnothing(p) ? ef() : ef(p)\n            anim = Animation([0, 1], [0.0, 1.0], easing)\n            yy = at.(anim, xx)\n            if isnothing(p)\n                a.plot(xx, yy)\n            else\n                a.plot(xx, yy, label=\"$p\")\n            end\n        end\n        if ps != [nothing]\n            a.legend(loc=\"center\", bbox_to_anchor=(1, 0.5), frameon=false, borderpad=0, borderaxespad=0, handlelength=0.5)\n        end\n    end\n\n    fig\nend\nfig = easingplots()\nfig.savefig(\"easingplots.svg\")\nnothing","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Repeats,-Yoyo,-Pre-and-Postwait-1","page":"Animations.jl","title":"Repeats, Yoyo, Pre- and Postwait","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Often you have two values that you interpolate between, but you want a more interesting animation than just going from a to b. Each easing function takes four keyword arguments that you can use for that, n, yoyo, prewait and postwait.","category":"page"},{"location":"#Repeats-1","page":"Animations.jl","title":"Repeats","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Use the n keyword for repeats:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"\nanim = Animation(\n    0, 0.0,\n    linear(n=3),\n    2, 1.0\n)\n\nts = 0:0.01:2\nys = at.(anim, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_n_keyword.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Yoyo-1","page":"Animations.jl","title":"Yoyo","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"As you can see, repeats lead to breaks in the animation, which might be what you want, but often you want a back-and-forth motion between two values, like a yoyo. That's what the yoyo parameter is for:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"\nanim = Animation(\n    0, 0.0,\n    linear(n=3, yoyo=true),\n    2, 1.0\n)\n\nts = 0:0.01:2\nys = at.(anim, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_yoyo.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Only if n is an odd number does an animation with yoyo end with the second keyframe value, otherwise it ends with the first. This is something to keep in mind. If you have a keyframe following after, you might want an odd number of repeats so there is no break, if you just want a looping animation without a break, you might want to choose an even number. Also, if you retrieve values from an animation for timestamps outside of its keyframes, all values before the first keyframe are the same as the first computed value, and all values after are the same as the last computed value, not the actual keyframe values. This is only relevant if you use even-numbered yoyo's though, which often happens with looping animations. See the difference here:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"\nanim_even = Animation(\n    0, 0.0,\n    linear(n=4, yoyo=true),\n    2, 1.0\n)\n\nanim_odd = Animation(\n    0, 0.0,\n    linear(n=3, yoyo=true),\n    2, 1.0\n)\n\nts = -0.5:0.01:3\nys_even = at.(anim_even, ts)\nys_odd = at.(anim_odd, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys_even, label=\"even\")\nplot(ts, ys_odd, label=\"odd\")\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\naxvline(0, 0, 1, color=\"gray\", linestyle=\"dashed\") # hide\naxvline(2, 0, 1, color=\"gray\", linestyle=\"dashed\", label=\"keyframes\") # hide\nlegend(loc=\"center\", bbox_to_anchor=(1, 0.5), frameon=false) # hide\ntight_layout() # hide\nsavefig(\"example_yoyo_evenodd.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Prewait-and-Postwait-1","page":"Animations.jl","title":"Prewait and Postwait","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Especially with yoyo animations, it often looks better if there is a slight moment of rest at the endpoints. You can easily achieve this with the prewait and postwait keywords. Their values are given in fractions of keyframe to keyframe duration, so prewait = 0.5 means the actual animation happens only in the second half. Here's an example:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"\nanim = Animation(\n    0, 0.0,\n    linear(prewait=0.1, postwait=0.3),\n    2, 1.0\n)\n\nts = 0:0.01:2\nys = at.(anim, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_prepostwait.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"If you use repeat or yoyo, each prewait and postwait period is just divided by the number of repeats:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"\nanim = Animation(\n    0, 0.0,\n    linear(prewait=0.1, postwait=0.3, n=2, yoyo=true),\n    2, 1.0\n)\n\nts = 0:0.01:2\nys = at.(anim, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_prepostwait_yoyo.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Colors-and-special-types-1","page":"Animations.jl","title":"Colors and special types","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Using Colors is enabled already, but you can add other custom types that can be interpolated:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"coloranim = Animation(\n    0, RGB(1, 0, 0),\n    sineio(),\n    1, RGB(0, 1, 0),\n    polyin(2),\n    2, RGB(0, 0, 1)\n)","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"For your own type T, if the generic (value2 - value1) * fraction + value1 doesn't work, just add a method linear_interpolate(fraction::Real, value1::T, value2::T) where T.","category":"page"},{"location":"#Arrays-1","page":"Animations.jl","title":"Arrays","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Interpolation also works easily with arrays of values:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Animation(\n    0, rand(25),\n    sineio(n=2, yoyo=true, prewait=0.3),\n    2, rand(25)\n)","category":"page"},{"location":"#Relative-timestamps-1","page":"Animations.jl","title":"Relative timestamps","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"If you're tweaking the length of parts of an animation, you can use rel() for a timestamp relative to the previous one, like so:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Animation(\n    0,        1.0,\n    rel(1),   2.0,\n    rel(3),   3.0,\n    rel(0.2), 0.0,\n    rel(0.4), 1.0\n)","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"This way it's easier to adjust one duration without having to change all following ones.","category":"page"},{"location":"#FiniteLengthAnimation-1","page":"Animations.jl","title":"FiniteLengthAnimation","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"Animations, Loops and Sequences are subtypes of FiniteLengthAnimation, which are required as the content for (finite) Loops and Sequences","category":"page"},{"location":"#Loops-1","page":"Animations.jl","title":"Loops","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"You can turn a FiniteLengthAnimation into a loop like this:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"anim = Animation(\n    0,   1.0,\n    sineio(),\n    0.5, 2.0,\n    polyin(3),\n    1,   1.0\n)\n\nstart = 0\ngap = 1\nrepetitions = 3\nloop = Loop(anim, start, gap, repetitions)\n\nts = 0:0.01:6\nys = at.(loop, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_loop.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Sequences-1","page":"Animations.jl","title":"Sequences","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"You can string together FiniteLengthAnimations into sequences like this:","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"anim1 = Animation(\n    0,   1.0,\n    sineio(),\n    0.5, 2.0,\n    polyin(3),\n    1,   1.0\n)\n\nanim2 = Animation(\n    0,   1.0,\n    saccadic(2),\n    0.5, 3.0,\n    expout(3),\n    1,   1.0\n)\n\nloop = Loop(anim2, 0, 0.5, 3)\n\nstart = 0\ngap = 1\nsequence = Sequence([anim1, loop], start, gap)\n\nts = 0:0.01:6\nys = at.(sequence, ts)\n\nfigure(figsize=(4, 2.5)) # hide\nplot(ts, ys)\nxlabel(\"t\") # hide\nylabel(\"animation value\") # hide\ntight_layout() # hide\nsavefig(\"example_sequence.svg\"); nothing # hide","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"(Image: )","category":"page"},{"location":"#Async-animations-1","page":"Animations.jl","title":"Async animations","text":"","category":"section"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"If you want to run animations live, e.g. in an interactive plotting context, you can use animate_async. You supply a variable number of animations, loops and sequences and a function. This function is called with the current time of the animation (starting at zero) and the evaluated result of each animation at that time.","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"animate_async(an_animation, a_sequence, a_loop) do t, v_anim, v_seq, v_loop\n    # do something with the animation values here, like updating a plot\nend","category":"page"},{"location":"#","page":"Animations.jl","title":"Animations.jl","text":"The return value of animate_async is an AnimationTask which just wraps a normal Task and a flag for signalling that the task should be stopped. You can send the stop signal by by calling stop(animationtask). It can not be guaranteed, though, that the task really stops (if it's stuck in some endless computation, for example, and doesn't reach the next loop).","category":"page"}]
}
