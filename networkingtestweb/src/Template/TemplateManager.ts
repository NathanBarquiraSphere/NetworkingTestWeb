import * as flatbuffers from 'flatbuffers';
import { Template } from './../schema/_Templates/shape-template/template';
import { Vec2 } from './../schema/_Templates/shape-template/vec2';
import { Unistroke, Point, DollarRecognizer } from './Recognizer';
import helloworld from './../assets/Templates/testtemplate.txt';

const download = async ({filename, blob}: {filename: string; blob: Blob}) => {
    const a: HTMLAnchorElement = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
  
    const url: string = window.URL.createObjectURL(blob);
  
    a.href = url;
    a.download = `${filename}.txt`;
  
    a.click();
  
    window.URL.revokeObjectURL(url);
    a.parentElement?.removeChild(a);
  };


export const save = (data: {blob: Blob, filename: string}) => {

    return download(data);

};

export class TemplateManager {

    UserInputKey:string = "UserInput";

    SaveTemplate = (TemplateName : string) => {
        const Input = localStorage.getItem(this.UserInputKey);

        if(typeof Input === 'string'){
            const Builder = new flatbuffers.Builder(256);

            const JsonInput = JSON.parse(Input);

            // Build array
            Template.startPointsVector(Builder, JsonInput['Input'].length);

            let i: number;
            for(i = JsonInput['Input'].length - 1; i >= 0 ; i--)
            {
                let X = JsonInput['Input'][i]['x'];
                let Y = JsonInput['Input'][i]['y'];

                Vec2.createVec2(Builder, X, Y);
            }

            const PointsOffset = Builder.endVector();

            // Create the string
            const TempString = Builder.createString(TemplateName);

            // Start the template object building
            Template.startTemplate(Builder);

            // Add points and name
            Template.addPoints(Builder,PointsOffset);
            Template.addName(Builder, TempString);

            // Get the offset for the finish template
            const TemplateOffset = Template.endTemplate(Builder);

            Builder.finish(TemplateOffset);
            const Built = Builder.asUint8Array();

            console.log(Built.byteLength);

            const newBlob = new Blob([Built]);
            save({ blob: newBlob, filename: TemplateName} );

            // this.LoadTemplate(Built);
        }
    }

    LoadTemplates = () : Promise<Unistroke[]>  => {
        let NewTemplates : Unistroke[] = [];

        const allTemplates = require.context('./../assets/Templates',true);
        const templateList = allTemplates.keys().map(text => allTemplates(text));

        return new Promise((resolve, reject) =>
        {
            for(let i = 0; i < templateList.length; i++)
            {
                fetch(templateList[i])
                .then(r => r.arrayBuffer())
                .then(data => {
                    const Data = new Uint8Array(data);
                    const buf = new flatbuffers.ByteBuffer(Data);
        
                    const template = Template.getRootAsTemplate(buf);
                    const newName = template.name();
                    const points = template.points;
                    let newPoints: Array<Point> = [];
        
                    let j: number = 0;
                    for(j = 0; j < template.pointsLength(); j++)
                    {
                        const point = template.points(j);
                        if(point)
                        {
                            const tempPoint = new Point(point.x(),point.y());
                            newPoints.push(tempPoint);
                        }
                    }
                    
                    if(typeof newName === 'string')
                    {
                        const newUnistroke = new Unistroke(newName,newPoints);
                        NewTemplates.push(newUnistroke);
                    }
                    else
                    {
                        reject();
                    }

                    if(i === templateList.length - 1)
                    {
                        resolve(NewTemplates);
                    }
               });
            }


        });
    }

    // TestLoading()
    // {
    //     const alltext = require.context('./../assets/Templates',true);
    //     const textList = alltext.keys().map(text => alltext(text));

    //     for(let i = 0; i < textList.length; i++)
    //     {
    //         fetch(textList[i])
    //         .then(r => r.arrayBuffer())
    //         .then(data => {
    //             const Data = new Uint8Array(data);
    //             const buf = new flatbuffers.ByteBuffer(Data);
    
    //             const template = Template.getRootAsTemplate(buf);
    //             const newName = template.name();
    //             const points = template.points;
    //             let newPoints: Array<Point> = [];
    
    //             let i: number = 0;
    //             for(i = 0; i < template.pointsLength(); i++)
    //             {
    //                 const point = template.points(i);
    //                 if(point)
    //                 {
    //                     const tempPoint = new Point(point.x(),point.y());
    //                     newPoints.push(tempPoint);
    //                 }
    //             }
                
    //             if(typeof newName === 'string')
    //             {
    //                 const newUnistroke = new Unistroke(newName,newPoints);
    
    //                 console.log(newUnistroke);
    //             }
    //         });
    //     }
    //     //const textFiles = alltext.keys().map(text => text(text));
    // }
}

