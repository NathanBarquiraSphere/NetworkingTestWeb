import React, { useState, useEffect } from 'react';
import { Button, HStack, ButtonGroup } from "@chakra-ui/react";

interface TemplateProps 
{
    AddTemplateFunction: (TemplateName: string) => void;
}

const AddTemplateWidget  = ({ AddTemplateFunction }: TemplateProps ) =>
{
    const [TemplateName, SetTemplateName] = useState('');

    const handleTemplateName = (event: any) => 
    {
        SetTemplateName(event.target.value);
    }

    const AddTemplate = () => 
    {
        AddTemplateFunction(TemplateName);
    }

    return (
        <section className="ipcon">
          <div>
            <div>
              <HStack spacing={4}>
                <input
                  type="text"
                  value={TemplateName}
                  onChange={handleTemplateName}
                  placeholder="INVALIDTEMPLATE"
                />
                <Button colorScheme="teal" onClick={AddTemplate}>
                  Add Template
                </Button>
              </HStack>
            </div>
          </div>
        </section>
      );
}

export default AddTemplateWidget;