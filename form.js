// Unsure of this constant.
var PtPIn = 72.0;
var CmPIn = 2.54;

var PPI = 96.0;

var HalfLineWidthCm = 0.0;

function transform_pt_to_px(s)
{
    return (s / PtPIn) * PPI;
}

function transform_width_to_px(s)
{
    return (s/300.0) * PPI;
}

function transform_width_to_cm(s)
{
    return (s/300.0) * CmPIn;
}

function transform_point(p)
{
    return {"x" : (p.x / CmPIn) * PPI, "y" : (p.y / CmPIn) * PPI};
}

function transform_xy(x, y)
{
    return transform_point({"x" : x, "y" : y});
}

function draw_line(ctx, x1, y1, x2, y2) {
    var p1 = transform_xy(x1, y1);
    var p2 = transform_xy(x2, y2);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
}

var element_draw_fns =
{"hline" :
 function(elem, ctx) {
        draw_line(ctx, elem.x, elem.y + HalfLineWidth, elem.x + elem.length, elem.y + HalfLineWidth);
    },
 "vline" :
 function(elem, ctx) {
     draw_line(ctx, elem.x + HalfLineWidth, elem.y, elem.x + HalfLineWidth, elem.y + elem.length);
 },
 "lwid" :
 function(elem, ctx) {
     width = transform_width_to_px(elem.width);
     ctx.lineWidth = width;
     HalfLineWidth = transform_width_to_cm(elem.width)/2
 },
 "text" :
 function(elem, ctx) {
     var p = transform_xy(elem.x, elem.y);
     ctx.fillText(elem.text, p.x, p.y);
 },
 "box" :
 function(elem, ctx) {
     var p1 = transform_xy(elem.x, elem.y);
     var p2 = transform_xy(elem.x2 - elem.x, elem.y2 - elem.y);
     ctx.beginPath();
     ctx.rect(p1.x, p1.y, p2.x, p2.y);
     ctx.closePath();
     ctx.stroke();
 },
 "font" :
 function(elem, ctx) {
     ctx.font = elem.modifiers + " " +
     transform_pt_to_px(elem.size) + "px " +
     elem.family;
 }};

function draw_pcl(pcl_elements, ctx) {
  
    function draw_pcl_element(elem) {
        if(element_draw_fns[elem.element]) {
            element_draw_fns[elem.element](elem, ctx);
        }
    }

    pcl_elements.forEach(draw_pcl_element);
}

function load_form(url, ctx) {
    function form_loaded(form) {
        draw_pcl(form.pcl, ctx);
    }

    var req = new Request.JSON({url: url, method: 'get',  onSuccess: form_loaded});
    req.send();
}
