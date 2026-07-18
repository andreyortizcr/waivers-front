import Logo from '../assets/logo-rcr.png'
import { MdOutlineShield } from "react-icons/md"
import SignatureCanvas from "react-signature-canvas"
import '../styles/Form.css'
import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from "dayjs"

import { Form, Button, Checkbox, DatePicker, Input, Space, Row, Col, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'

import { SignWarning } from './SignWarning'


export type WaiverFormData = {
    name: string
    under_age?: boolean
    legal_guardian: string
    //email: string
    tour_date: Dayjs
    tour_today?: boolean

    alcoholism: boolean
    claustrophobia: boolean
    dizzines: boolean
    ear_infection: boolean
    epilepsy: boolean
    peptic_ulcers: boolean
    respiratory_problems: boolean
    neck_injure: boolean
    back_problems: boolean
    drug_use: boolean
    depression: boolean
    heart_problems: boolean
    recent_operation: boolean
    headaches: boolean
    overweight: boolean

    preg?: boolean
    d_med_na?: boolean
    d_exa_na?: boolean
    d_xray_na?: boolean

    other_condition: string
    pregnancy: number
    medications: string

    date_medications?: Dayjs
    date_examination?: Dayjs
    date_xray?: Dayjs

    other_areas: string
    signature: string

    terms: boolean
}

const WaiverForm = () => {

    const [form] = Form.useForm<WaiverFormData>()
    const [loading, setLoading] = useState(false)
    const sigCanvasRef = useRef<SignatureCanvas>(null)
    const navigate = useNavigate()
    const { t } = useTranslation()


    const conditions = [
        { name: "alcoholism", label: t("conditions.alcoholism") },
        { name: "claustrophobia", label: t("conditions.claustrophobia") },
        { name: "dizziness", label: t("conditions.dizziness") },
        { name: "ear_infection", label: t("conditions.ear_infection") },
        { name: "epilepsy", label: t("conditions.epilepsy") },
        { name: "peptic_ulcers", label: t("conditions.peptic_ulcers") },
        { name: "respiratory_problems", label: t("conditions.respiratory_problems") },
        { name: "neck_injure", label: t("conditions.neck_injury") },
        { name: "back_problems", label: t("conditions.back_problems") },
        { name: "drug_use", label: t("conditions.drug_use") },
        { name: "depression", label: t("conditions.depression") },
        { name: "heart_problems", label: t("conditions.heart_problems") },
        { name: "recent_operation", label: t("conditions.recent_operation") },
        { name: "headaches", label: t("conditions.headaches") },
        { name: "overweight", label: t("conditions.overweight") }
    ]


    // Detects if the box is checked
    const isTourToday = Form.useWatch('tour_today', form)
    const isUnderAge = Form.useWatch('under_age', form)
    const isPregnant = Form.useWatch('preg', form)
    const dateMedNa = Form.useWatch('d_med_na', form)
    const dateExamNa = Form.useWatch('d_exa_na', form)
    const dateXrayNa = Form.useWatch('d_xray_na', form)



    // Clear optional fields
    useEffect(() => {
        if (isTourToday) {
            form.setFieldsValue({ tour_date: dayjs().startOf('day') })
        } else {
            form.setFieldsValue({ tour_date: undefined })
        }
    }, [isTourToday, form])

    useEffect(() => {
        if (!isUnderAge) {
            form.setFieldsValue({ legal_guardian: undefined })
        }
    }, [isUnderAge, form])

    useEffect(() => {
        if (isPregnant) {
            form.setFieldsValue({ pregnancy: undefined })
        }
    }, [isPregnant, form])

    useEffect(() => {
        if (dateMedNa) {
            form.setFieldsValue({ date_medications: undefined })
        }
    }, [dateMedNa, form])

    useEffect(() => {
        if (dateExamNa) {
            form.setFieldsValue({ date_examination: undefined })
        }
    }, [dateExamNa, form])

    useEffect(() => {
        if (dateXrayNa) {
            form.setFieldsValue({ date_xray: undefined })
        }
    }, [dateXrayNa, form])


    // Clean signature
    const clearCanvas = () => {
        sigCanvasRef.current?.clear()
        form.resetFields(['signature'])
    }


    /**
     * Fill in the fields, validate signature, send to backend.
     */
    const onFinish = async (values: WaiverFormData) => {

        try {

            if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) { return }

            // If minor, asks the guardians name, otherwise, send “Adult”
            const legalGuardian = values.under_age && values.legal_guardian ? values.legal_guardian : 'Adult'
            const tourDate = values.tour_date.format('YYYY-MM-DD')

            const personalData = {
                name: values.name,
                legal_guardian: legalGuardian,
                //email: values.email,
                tour_date: tourDate,
            }

            const medicalConditions = {
                alcoholism: !!values.alcoholism,
                claustrophobia: !!values.claustrophobia,
                dizzines: !!values.dizzines,
                ear_infection: !!values.ear_infection,
                epilepsy: !!values.epilepsy,
                peptic_ulcers: !!values.peptic_ulcers,
                respiratory_problems: !!values.respiratory_problems,
                neck_injure: !!values.neck_injure,
                back_problems: !!values.back_problems,
                drug_use: !!values.drug_use,
                depression: !!values.depression,
                heart_problems: !!values.heart_problems,
                recent_operation: !!values.recent_operation,
                headaches: !!values.headaches,
                overweight: !!values.overweight
            }

            const medicalDates = {
                other_condition: values.other_condition ?? 'Ninguno',
                pregnancy: values.preg ? 0 : (values.pregnancy ?? 0),
                medications: values.medications ?? 'Ninguno',
                date_medications: values.d_med_na ? '1001-01-01' : values.date_medications?.format('YYYY-MM-DD'),
                date_examination: values.d_exa_na ? '1001-01-01' : values.date_examination?.format('YYYY-MM-DD'),
                date_xray: values.d_xray_na ? '1001-01-01' : values.date_xray?.format('YYYY-MM-DD'),
                other_areas: values.other_areas ?? 'Ninguno'
            }

            // Convert canvas to png
            const signature = sigCanvasRef.current.toDataURL("image/png", 0.6)

            const waiver = {
                ...personalData,
                ...medicalConditions,
                ...medicalDates,
                signature
            }

            setLoading(true)

            // POST to backend, save the waiver
            await fetch(
                `${import.meta.env.VITE_API_URL}/api/waivers`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(waiver)
                }
            )

            navigate('/success', { state: { /*email: values.email,*/ tour_date: tourDate } })

            form.resetFields()
            sigCanvasRef.current.clear()

        } catch (err) {
        }
        finally {
            setLoading(false)
        }
    }




    return (

        <div>

            <div className="form-page">

                {/** Form Header */}
                <div className="form-header">
                    <div className="form-header-title">
                        <img src={Logo} className="form-header-img" />
                    </div>
                    <h2 className="form-title">{t("form.title")}</h2>
                    <p className="form-description">{t("form.description1")}<br />{t("form.description2")}</p>
                </div>


                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    onFinish={onFinish}
                    scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                >

                    {/** Personal Data */}
                    <div className='form-card'>
                        <div className='form-content-container'>


                            <div className="card-title">
                                {t("form.personalInfo")}
                            </div>


                            <Row gutter={16}>

                                <Col xs={24} sm={16}> {/** set sm to 12, if email is enabled */}
                                    <Form.Item
                                        name={"name"}
                                        label={<span>{t("form.name")} <span style={{ color: 'red' }}>*</span> </span>}
                                        rules={[{ required: true, message: t("form.nameError") },
                                        { max: 59, message: t("form.max60Characters") }
                                        ]}
                                    >
                                        <Input maxLength={60} />
                                    </Form.Item>
                                    <Form.Item
                                        name={"under_age"}
                                        valuePropName="checked"
                                        style={{ marginBottom: 18 }}
                                    >
                                        <Checkbox ><span className="guardian-checkbox">{t("form.under18")}</span></Checkbox>
                                    </Form.Item>
                                </Col>


                                {/** Delete, if email is enabled */}
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        name={"tour_date"}
                                        label={<span>{t("form.tourDate")} <span style={{ color: 'red' }}>*</span> </span>}
                                        rules={[{ required: true, message: t("form.tourDateError") }]}
                                    >
                                        <DatePicker style={{ width: "100%" }} placeholder='' disabled={isTourToday} disabledDate={(current) => current && current < dayjs().startOf('day')} />
                                    </Form.Item>
                                    <Form.Item name="tour_today" valuePropName="checked" style={{ marginTop: -20 }}>
                                        <Checkbox className="na-checkbox"> {t("form.tourToday")} </Checkbox>
                                    </Form.Item>
                                </Col>

                                {/**  
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name={"email"}
                                        label={t("form.email")}
                                        rules={[{ required: true, message: t("form.emailError") },
                                        { max: 59, message: t("form.max60Characters") },
                                        { type: "email", message: t("form.emailValid") }
                                        ]}
                                    >
                                        <Input maxLength={60} />
                                    </Form.Item>
                                </Col>
                                */}

                            </Row>

                            {isUnderAge && (
                                <Form.Item
                                    name={"legal_guardian"}
                                    label={<span>{t("form.tutorName")} <span style={{ color: 'red' }}>*</span> </span>}
                                    rules={[{ required: true, message: t("form.tutorNameError") },
                                    { max: 59, message: t("form.max60Characters") }
                                    ]}
                                >
                                    <Input maxLength={60} />
                                </Form.Item>
                            )}

                            {/** Activate if email is enabled
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name={"tour_date"}
                                        label={t("form.tourDate")}
                                        rules={[{ required: true, message: t("form.tourDateError") }]}
                                    >
                                        <DatePicker placeholder='' disabledDate={(current) => current && current < dayjs().startOf('day')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                             */}


                        </div>
                    </div>


                    {/** Medical conditions */}
                    <div className='form-card'>
                        <div className='form-content-container'>


                            <div className="card-title2">{t("form.medicalConditions")}</div>
                            <div className="card-description">{t("form.medicalConditionsDesc")}</div>

                            <Row gutter={16} className="conditions-grid">
                                {conditions.map((condition, index) => (
                                    <Col span={12} key={index}>
                                        <Form.Item
                                            name={condition.name} valuePropName="checked" noStyle
                                        >
                                            <Checkbox>
                                                <span className="conditions">{condition.label}</span>
                                            </Checkbox>
                                        </Form.Item>

                                    </Col>
                                ))}
                            </Row>

                            <Form.Item
                                name={"other_condition"}
                                label={t("form.otherConditions")}
                                style={{ marginTop: '1.5rem' }}
                                rules={[{ max: 119, message: t("form.max120Characters") }]}
                            >
                                <Input maxLength={120} />
                            </Form.Item>


                            <Form.Item
                                label={t("form.pregnancy")}
                                style={{ marginTop: '1.5rem' }}
                            >
                                <div className='form_na_field'>
                                    <Form.Item name={"pregnancy"} noStyle>
                                        <InputNumber min={0} max={9} disabled={isPregnant} />
                                    </Form.Item>

                                    <Form.Item name={"preg"} valuePropName="checked" noStyle>
                                        <Checkbox className='na-checkbox'> {t("form.applicable")} </Checkbox>
                                    </Form.Item>
                                </div>
                            </Form.Item>


                            <Form.Item
                                name={"medications"}
                                label={t("form.actualMedicines")}
                                rules={[{ max: 119, message: t("form.max120Characters") }]}
                            >
                                <Input maxLength={120} />
                            </Form.Item>


                            <Row gutter={16}>

                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label={<span>{t("form.lastMedicine")} <span style={{ color: 'red' }}>*</span> </span>}
                                        className="form-date-item"
                                    >
                                        <div className='form_na_field'>
                                            <Form.Item
                                                name={"date_medications"}
                                                rules={dateMedNa ? [] : [{ required: true, message: t("form.lastMedicineError") }]}
                                                noStyle
                                            >
                                                <DatePicker placeholder='' className="datepicker" disabledDate={(current) => current && current > dayjs().endOf('day')} disabled={dateMedNa} />
                                            </Form.Item>
                                            <Form.Item name={"d_med_na"} valuePropName="checked" noStyle>
                                                <Checkbox className="na-checkbox"> {t("form.applicable")} </Checkbox>
                                            </Form.Item>
                                        </div>
                                    </Form.Item>

                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label={<span>{t("form.lastMedEx")} <span style={{ color: 'red' }}>*</span> </span>}
                                        className="form-date-item"
                                    >

                                        <div className='form_na_field'>
                                            <Form.Item
                                                name={"date_examination"}
                                                rules={dateExamNa ? [] : [{ required: true, message: t("form.lastMedExError") }]}
                                                noStyle
                                            >
                                                <DatePicker placeholder='' className="datepicker" disabledDate={(current) => current && current > dayjs().endOf('day')} disabled={dateExamNa} />
                                            </Form.Item>
                                            <Form.Item name={"d_exa_na"} valuePropName="checked" noStyle>
                                                <Checkbox className="na-checkbox"> {t("form.applicable")} </Checkbox>
                                            </Form.Item>
                                        </div>

                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label={<span>{t("form.lastRad")} <span style={{ color: 'red' }}>*</span> </span>}
                                        className="form-date-item"
                                    >
                                        <div className='form_na_field'>
                                            <Form.Item
                                                name={"date_xray"}
                                                rules={dateXrayNa ? [] : [{ required: true, message: t("form.lastRadError") }]}
                                                noStyle
                                            >
                                                <DatePicker placeholder='' className="datepicker" disabledDate={(current) => current && current > dayjs().endOf('day')} disabled={dateXrayNa} />
                                            </Form.Item>
                                            <Form.Item name={"d_xray_na"} valuePropName="checked" noStyle>
                                                <Checkbox className="na-checkbox"> {t("form.applicable")} </Checkbox>
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                </Col>

                            </Row>


                            <Form.Item
                                name={"other_areas"}
                                label={t("form.otherAreas")}
                                rules={[{ max: 119, message: t("form.max120Characters") }]}
                            >
                                <Input maxLength={120} />
                            </Form.Item>

                        </div>
                    </div>


                    {/** Signature */}
                    <div className='form-card'>
                        <div className='form-content-container'>

                            <div className="card-title2">{t("form.signature")}</div>
                            <div className="card-description">{t("form.signatureDesc")}</div>


                            {isUnderAge && (
                                <SignWarning />
                            )}


                            {/** Signature, cannot be empty*/}
                            <Form.Item
                                name="signature"
                                rules={[{
                                    validator: async () => {
                                        const sign = sigCanvasRef.current
                                        if (!sign || sign.isEmpty()) {
                                            return Promise.reject(t("form.signatureError"))
                                        }
                                        return Promise.resolve()
                                    }
                                }]}
                            >
                                <SignatureCanvas ref={sigCanvasRef} onBegin={() => form.setFields([{ name: 'signature', errors: [] }])}
                                    backgroundColor="white" clearOnResize={false} canvasProps={{ className: 'signature-canvas' }}></SignatureCanvas>
                            </Form.Item>

                            <button type='button' className="cleanbutton" onClick={clearCanvas} >{t("form.clearButton")}</button>
                        </div>
                    </div>


                    {/** Terms */}
                    <div className="form-card">
                        <Form.Item
                            name={"terms"}
                            valuePropName="checked"
                            className='form-terms-check'
                            rules={[{ required: true, message: t("form.termsError") }]}
                        >
                            <Checkbox className='form-warning-card'>
                                <div className='form-warning-description'>
                                    {t("form.terms")}
                                </div>
                            </Checkbox>
                        </Form.Item>

                        <div className="form-privacy-card">
                            <p className="form-privacy-text">
                                <MdOutlineShield className='form-privacy-icon' />
                                {t("form.security")}
                            </p>

                        </div>

                        <div className='form-submit-container'>
                            <Form.Item>
                                <Space>
                                    <Button htmlType="submit" className="submit-button" loading={loading}>
                                        {loading ? t("form.submitButtonLoading") : t("form.submitButton")}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </div>


                    </div>

                </Form>

            </div >
        </div >
    )
}


export default WaiverForm