import React, {useReducer} from "react";
import data from "../data.json";
import { PageHeader } from "react-bootstrap";
import Headers from "./Headers";
import { Button, Card, CardTitle, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader} from "reactstrap";

const Body = ()=> {
    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "inputChange":
                    return { ...state, [action.fieldName]: action.fieldValue };
                case "bookTimeSlot":
                    return {
                        ...state,
                        timeslots: state.timeslots.map(timeslot => {
                            if (timeslot.id !== state.timeslotID) {
                                return timeslot;
                            }
                            return {
                                ...timeslot,
                                booked: true,
                                contactName: state.contactName,
                                contactPhone: state.contactPhone
                            };
                        })
                    };
                case "closeBookingModal":
                    return {
                        ...state,
                        bookingModalStatus: "closed",
                        timeslotID: null,
                        contactName: "",
                        contactPhone: ""
                    };
                case "openBookingModal":
                    return {
                        ...state,
                        bookingModalStatus: "opened",
                        timeslotID: action.timeslotID
                    };
                case "closeReviewingModal":
                    return {
                        ...state,
                        reviewingModalStatus: "closed",
                        timeslotID: null,
                        contactName: "",
                        contactPhone: ""
                    };
                case "openReviewingModal":
                    const { contactName, contactPhone } = state.timeslots.find(
                        ({ id }) => id === action.timeslotID
                    ) || { contactName: "y", contactPhone: "u" };
                    return {
                        ...state,
                        reviewingModalStatus: "opened",
                        timeslotID: action.timeslotID,
                        contactName,
                        contactPhone
                    };
                default:
                    return state;
            }
        },
        {
            timeslots: data,
            bookingModalStatus: "closed",
            reviewingModalStatus: "closed",
            contactName: "",
            contactPhone: "",
            timeslotID: null
        }
    );
    const {
        timeslots,
        bookingModalStatus,
        reviewingModalStatus,
        contactName,
        contactPhone,
    } = state;

    const onCloseBookingModal = (e)=> {
        dispatch({ type: "closeBookingModal" });
    }
    const onOpenBookingTimeSlot = (e)=> {
        console.log(e.target.getAttribute("data-timeslot-id"));
        const timeslotID = parseInt(e.target.getAttribute("data-timeslot-id"), 10);
        dispatch({ type: "openBookingModal", timeslotID });
    }

    const onUpdatingTimeSlot = (e) => {
        const timeslotID = parseInt(e.target.getAttribute("data-timeslot-id"), 10);
        dispatch({ type: "openReviewingModal", timeslotID });
    }
    const onCloseReviewingModal = () => {
        dispatch({ type: "closeReviewingModal" });
    }

    const isValidContact =(number) =>{
        const validRegex = /^\d{10}$/;
        if(number.match(validRegex)){
            return true;
        }
        else
        {
            return false;
        }
    }
    const onFormFieldChange = (e) => {
        dispatch({
            type: "inputChange",
            fieldName: e.target.name,
            fieldValue: e.target.value
        });
    }
    const onBookTimeSlot = (e) => {
        e.preventDefault();

        if (contactName === "" || contactPhone === "" ) {
            return;
        }
        if(!isValidContact(contactPhone)){
            alert('Enter Valid Phone number');
            return;
        }
        dispatch({ type: "bookTimeSlot" });
        dispatch({ type: "closeBookingModal" });
    }
    const onUpdateTimeSlot = (e) => {
        e.preventDefault();
        if(!isValidContact(contactPhone)){
            alert('Enter Valid Phone number');
            return;
        }
        dispatch({ type: "bookTimeSlot" });
        dispatch({ type: "closeReviewingModal" });
    }
    return (
        <>
            <PageHeader className="text-sm-left text-md-center Header">
                <Headers/>
            </PageHeader>;

            <Container className="App">
                    {timeslots.map(({ id, startTime, endTime, booked }) => {
                        if (!booked) {
                            return (
                                <div className={"Row"}>
                                    <Card body key={id}>
                                        <CardTitle tag="h5">{`${startTime} - ${endTime}`}</CardTitle>
                                        <Button
                                            color="primary"
                                            onClick={onOpenBookingTimeSlot}
                                            data-timeslot-id={id}
                                        >
                                            Book
                                        </Button>
                                    </Card>
                                 &nbsp;
                                </div>

                            );
                        }
                        return (
                            <div className={"Row"}>
                                <Card body key={id} color="danger" outline>
                                    <CardTitle tag="h5">{`${startTime} - ${endTime}`}</CardTitle>
                                    <Button
                                        color="danger"
                                        onClick={onUpdatingTimeSlot}
                                        data-timeslot-id={id}
                                    >
                                        Update
                                    </Button>
                                </Card>
                                &nbsp;
                            </div>
                        );
                    })}

                <Modal
                    isOpen={bookingModalStatus === "opened"}
                    toggle={onCloseBookingModal}
                    className="bookingModal"
                >
                    <ModalHeader toggle={onCloseBookingModal}>
                        Please Enter Your Contact Information.
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={onBookTimeSlot}>
                            <FormGroup>
                                <Label for="contactName">Your Name</Label>
                                <Input
                                    type="text"
                                    name="contactName"
                                    id="contactName"
                                    placeholder="Enter Your Name"
                                    onChange={onFormFieldChange}
                                    value={contactName}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="contactPhone">Your Phone Number</Label>
                                <Input
                                    type="tel"
                                    name="contactPhone"
                                    id="contactPhone"
                                    placeholder="Enter your contact number"
                                    onChange={onFormFieldChange}
                                    value={contactPhone}
                                />
                            </FormGroup>
                            <Button
                                type="submit"
                                color="primary"
                                className="mx-1"
                                onClick={onBookTimeSlot}
                            >
                                Book
                            </Button>
                            <Button
                                color="secondary"
                                className="mx-1"
                                onClick={onCloseBookingModal}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal
                    isOpen={reviewingModalStatus === "opened"}
                    toggle={onCloseReviewingModal}
                    className="reviewingModal"
                >
                    <ModalHeader toggle={onCloseReviewingModal}>
                        Update Your Contact Information.
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={onUpdateTimeSlot}>
                            <FormGroup>
                                <Label for="contactName2">Your Name</Label>
                                <Input
                                    type="text"
                                    name="contactName"
                                    id="contactName2"
                                    placeholder="First and Last Name"
                                    onChange={onFormFieldChange}
                                    value={contactName}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="contactPhone2">Your Phone Number</Label>
                                <Input
                                    type="tel"
                                    name="contactPhone"
                                    id="contactPhone2"
                                    placeholder="1-(555)-555-5555"
                                    onChange={onFormFieldChange}
                                    value={contactPhone}
                                />
                            </FormGroup>
                            <Button
                                type="submit"
                                color="primary"
                                className="mx-1"
                                onClick={onUpdateTimeSlot}
                            >
                                Save Changes
                            </Button>
                            <Button
                                color="secondary"
                                className="mx-1"
                                onClick={onCloseReviewingModal}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </>
    );
}
export default Body;
