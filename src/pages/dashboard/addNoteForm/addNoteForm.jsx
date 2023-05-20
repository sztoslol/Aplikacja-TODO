import "./addNoteForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    noteName: Yup.string().required("Uzupełnij to pole!"),
    noteDescription: Yup.string().required("Uzupełnij to pole!"),
});

const AddNoteForm = ({ handleCloseForm }) => {
    const handleSubmit = (values, { resetForm }) => {
        fetch("http://localhost:3010/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: values.noteName,
                description: values.noteDescription,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log("Notatka dodana!");
                resetForm();
                handleCloseForm();
            })
            .catch((error) => {
                console.error(
                    "There was a problem with your fetch operation:",
                    error
                );
            });
    };

    return (
        <div className='noteForm-main'>
            <div className='noteForm-header'>Notatka</div>
            <div className='noteForm-subheader'>
                Aby dodać notatkę wypełnij pola poniżej
            </div>

            <Formik
                initialValues={{
                    noteName: "",
                    noteDescription: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className='noteForm-input-notename'>
                            <div className='noteForm-input-notename-top'>
                                <div className='noteForm-input-notename-text'>
                                    Nazwa notatki
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='noteName'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    <div
                                        className='dot'
                                        style={{
                                            display:
                                                errors.noteName &&
                                                touched.noteName
                                                    ? "block"
                                                    : "none",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <Field
                                type='text'
                                name='noteName'
                                className='noteForm-notename'
                                placeholder='Przykładowa nazwa notatki'
                            />
                        </div>

                        <div className='noteForm-input-desc'>
                            <div className='noteForm-input-notedesc-top'>
                                <div className='noteForm-input-desc-text'>
                                    Opis notatki
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='noteDescription'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    <div
                                        className='dot'
                                        style={{
                                            display:
                                                errors.noteDescription &&
                                                touched.noteDescription
                                                    ? "block"
                                                    : "none",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <Field
                                as='textarea'
                                name='noteDescription'
                                className='noteForm-desc'
                                placeholder='Przykładowy opis notatki'
                            />
                        </div>

                        <button className='noteForm-button' type='submit'>
                            Potwierdź
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddNoteForm;
