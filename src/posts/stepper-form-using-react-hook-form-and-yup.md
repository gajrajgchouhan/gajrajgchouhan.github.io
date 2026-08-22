---
title: Stepper Form using react-hook-form and yup
date: 2022-03-27
slug: stepper-form-using-react-hook-form-and-yup
status: published
---

Recently, I had to create to a stepper form for a website.

A stepper form looks like this -

![Screenshot from 2022-03-27 10-59-18.png](/images/stepper-form-using-react-hook-form-and-yup/ph3Uw3-N2-433bb76d.png) _source - https://material.angular.io/components/stepper/overview_

To create this using react-hook-form, follow these steps.

1.  Install the necessary dependencies

```bash
npm i react-hook-form react-form-stepper @hookform/resolvers yup
```

1.  Create `Stepper.js`
    
2.  Import dependencies.
    

```jsx
import { FormOne, FormThree, FormTwoSelf, FormTwoOthers } from "./Forms";
import { Stepper } from "react-form-stepper";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Loader } from "../../components/Loader";
```

This will import the stepper components, the forms itself and some react hooks.

1.  Create the steps.

```jsx
const steps = ["One", "Two", "Three"];

const onSubmit = (data) => {
    console.log(data);
    // add necessary logic like POSTing to API or something.
};

// self is a variable, we can use any type of conditions :D
// I'll tell how to create the forms in next steps.
function getStepContent(step, formContent, handleNext, ref, self) {
    switch (step) {
        case 0:
            return <FormOne {...{ handleNext }} _ref={ref} />;
        case 1:
            if (self) return <FormTwoSelf {...{ handleNext }} _ref={ref} />;
            else return <FormTwoOthers {...{ handleNext }} _ref={ref} />;
        case 2:
            return <FormThree {...{ formContent, handleNext }} _ref={ref} />;
    }
}
```

1.  Now create the form stepper itself.

```jsx
export const FormStepper = () => {
    const [activeStep, setActiveStep] = useState(0); // store which step is the form at.
    const [compiledForm, setCompiledForm] = useState({}); // store the whole form data
    const ref = useRef(null);
    const [self, setSelf] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => console.log("compiledForm", compiledForm), [compiledForm]);

    useEffect(() => {
        if (activeStep === steps.length) {
            setLoading(true);
            const data = Object.values(compiledForm).reduce(
                (prev, curr) => ({
                    ...prev,
                    ...curr,
                }),
                {}
            ); 
            // the compiledForm is in form of {0: form_data, 1: form_data, .... } hence using the reducer
            console.log(data);
            // show a loader while POSTing
            // onSubmit(data);
            setLoading(false);
        }
    }, [activeStep]);

    const handleNext = (data) => {
        setCompiledForm({ ...compiledForm, [activeStep]: data });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setCompiledForm({ ...compiledForm, [activeStep]: {} });
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    return (
        <div>
            <Stepper
                styleConfig={{
                    activeBgColor: "#3a936c",
                    completedBgColor: "#146240",
                    fontWeight: "bold",
                }}
                steps={steps.map((step) => ({
                    label: "Step " + step,
                }))}
                activeStep={activeStep}
            />
            <div>
                {activeStep === steps.length ? (
                    <div className="flex flex-col justify-center">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="text-center">Completed</div>
                        )}
                        <Button variant="outline-success" onClick={() => {}}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <div>
                        {getStepContent(
                            activeStep,
                            compiledForm,
                            handleNext,
                            ref,
                            self
                        )}
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline-danger"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                            >
                                Back
                            </Button>
                            // the next button will click on hidden submit button hence allowing the validation to take place.
                            <Button
                                type="submit"
                                variant="outline-success"
                                onClick={() => ref.current.click()}
                            >
                                {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
```

1.  Store the form components in `Forms.js`. We can import necessary dependencies and schemas for validation.

```jsx
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    fundraiserTypeOptions,
    GradeOptions,
    fundraisingTypeOptions,
    formOneSchema,
} from "./schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAuthenticatedSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";

export const FormOne = ({ handleNext, _ref }) => {
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const methods = useForm({
        resolver: yupResolver(formOneSchema[!!isAuthenticated]),
    });
    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(handleNext)}
                className="flex flex-col gap-4 my-4"
            >
                <RenderSelect
                    inputName="fundraisingType"
                    options={fundraisingTypeOptions}
                    placeholder="Fundraising Type"
                />
                <RenderSelect
                    inputName="fundraiserType"
                    options={fundraiserTypeOptions}
                    placeholder="You are raising funds for.."
                />
                {!isAuthenticated ? (
                    <>
                        <InputRender
                            inputName="Tel"
                            label="+91"
                            props={{
                                type: "tel",
                                placeholder: "Mobile Number",
                            }}
                        />
                        <div className="flex gap-2">
                            <InputRender
                                inputName="FirstName"
                                props={{
                                    type: "text",
                                    placeholder: "First Name",
                                    autoComplete: "given-name",
                                }}
                            />
                            <InputRender
                                inputName="LastName"
                                props={{
                                    type: "text",
                                    placeholder: "Last Name",
                                    autoComplete: "family-name",
                                }}
                            />
                        </div>
                        <InputRender
                            props={{
                                type: "text",
                                placeholder: "Address",
                                autoComplete: "street-address",
                            }}
                            inputName="StreetAddress"
                        />
                        <InputRender
                            props={{
                                type: "text",
                                placeholder: "City",
                                autoComplete: "address-level2",
                            }}
                            inputName="City"
                        />
                        <RenderSelect
                            inputName="State"
                            options={StatesOptions}
                            placeholder="State"
                        />
                    </>
                ) : null}
                // this is the important part as clicking on next will actually submit the form using this hidden button 
                <button type="submit" hidden={true} ref={_ref}></button>
            </form>
        </FormProvider>
    );
};
```

As seen above the hidden button allows the submission, this has to be used in each form. Also make sure the field names in each form is unique so that they are not over written after the form is finished.

I also used tailwind and bootstrap button in this project.

References:

1.  https://codesandbox.io/embed/stepper-with-react-hook-form-qpjc1
