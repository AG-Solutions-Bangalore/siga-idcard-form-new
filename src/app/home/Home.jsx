import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MinusCircle, CheckCircle, Upload, ImageUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);
  const [participants, setParticipants] = useState({
    id_name_of_firm: "",
    id_card_brand_name: "",
    id_firm_email: "",
  });

  const [errors, setErrors] = useState({
    id_name_of_firm: "",
    id_card_brand_name: "",
    id_firm_email: "",
    representatives: []
  });

  const representativeTemplate = {
    idcardsub_rep_name: "",
    idcardsub_rep_mobile: null,
    idcardsub_rep_image: null
  };

  const [representatives, setRepresentatives] = useState([{...representativeTemplate}]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = Math.floor(window.innerWidth / 50);
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          size: Math.random() * 3 + 1,
          duration: 5 + Math.random() * 10,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 10000);
    return () => clearInterval(interval);
  }, []);

  const createIdCardMutation = useMutation({
    mutationFn: async (formData) => {
      // console.log("Mutation triggered with formData:");
      
  
      try {
        const response = await axios.post(
          `${BASE_URL}/api/insert-participant-idcard`,
          formData,
          {
            headers: {
           
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        // console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Error:", error); 
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.msg || "ID Card created successfully",
        className: "bg-green-100 text-green-800",
      });
      navigate("/thankyou");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response.data.message || "Something went wrong",
        variant: "destructive",
        className: "bg-red-100 text-red-800",
      });
    },
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      id_name_of_firm: "",
      id_card_brand_name: "",
      id_firm_email: "",
      representatives: Array(representatives.length).fill({
        idcardsub_rep_name: "",
        idcardsub_rep_mobile: "",
        idcardsub_rep_image: ""
      })
    };

    if (!participants.id_name_of_firm.trim()) {
      newErrors.id_name_of_firm = "Firm name is required";
      isValid = false;
    }

    if (!participants.id_card_brand_name.trim()) {
      newErrors.id_card_brand_name = "Brand name is required";
      isValid = false;
    }

    if (!participants.id_firm_email.trim()) {
      newErrors.id_firm_email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participants.id_firm_email)) {
      newErrors.id_firm_email = "Please enter a valid email";
      isValid = false;
    }

    representatives.forEach((rep, index) => {
      const repErrors = {
        idcardsub_rep_name: "",
      
        idcardsub_rep_image: ""
      };

      if (!rep.idcardsub_rep_name.trim()) {
        repErrors.idcardsub_rep_name = " name is required";
        isValid = false;
      }

 

      if (!rep.idcardsub_rep_image) {
        repErrors.idcardsub_rep_image = "Image is required";
        isValid = false;
      } else if (rep.idcardsub_rep_image.size > 5000000) {
        repErrors.idcardsub_rep_image = "File size should be less than 5MB";
        isValid = false;
      }

      newErrors.representatives[index] = repErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParticipants(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleRepresentativeChange = (index, field, value) => {
    const newRepresentatives = [...representatives];
    newRepresentatives[index] = {
      ...newRepresentatives[index],
      [field]: value
    };
    setRepresentatives(newRepresentatives);

    if (errors.representatives[index]?.[field]) {
      const newErrors = { ...errors };
      newErrors.representatives[index][field] = "";
      setErrors(newErrors);
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleRepresentativeChange(index, 'idcardsub_rep_image', file);
      
      if (errors.representatives[index]?.idcardsub_rep_image) {
        const newErrors = { ...errors };
        newErrors.representatives[index].idcardsub_rep_image = "";
        setErrors(newErrors);
      }
    }
  };

  const addRepresentative = () => {
    setRepresentatives([...representatives, {...representativeTemplate}]);
 
    setErrors(prev => ({
      ...prev,
      representatives: [...prev.representatives, {
        idcardsub_rep_name: "",
        idcardsub_rep_mobile: "",
        idcardsub_rep_image: ""
      }]
    }));
  };

  const removeRepresentative = (index) => {
    if (representatives.length > 1) {
      const newRepresentatives = representatives.filter((_, i) => i !== index);
      setRepresentatives(newRepresentatives);
      
      const newErrors = { ...errors };
      newErrors.representatives = newErrors.representatives.filter((_, i) => i !== index);
      setErrors(newErrors);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    try {
      const register_counter = representatives.length;
      
      const formData = new FormData();
      formData.append("id_name_of_firm", participants.id_name_of_firm);
      formData.append("id_card_brand_name", participants.id_card_brand_name);
      formData.append("id_firm_email", participants.id_firm_email);
      formData.append("register_counter", register_counter.toString());
      
      representatives.forEach((rep, index) => {
        formData.append(`idcardsub[${index}][idcardsub_rep_name]`, rep.idcardsub_rep_name);
      
          formData.append(`idcardsub[${index}][idcardsub_rep_mobile]`, rep.idcardsub_rep_mobile);
     
    
          formData.append(`idcardsub[${index}][idcardsub_rep_image]`, rep.idcardsub_rep_image);
     
      });
  
      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // console.log("Calling mutation..."); 
      createIdCardMutation.mutate(formData);
      // console.log("Mutation completed"); 
    } catch (error) {
      // console.error("Submission error:", error); 
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-4 relative overflow-hidden min-h-screen">
   
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-orange-50/20">
        
          <div className="absolute inset-0 bg-[length:30px_30px] bg-[linear-gradient(to_right,#fef3c7_1px,transparent_1px),linear-gradient(to_bottom,#fef3c7_1px,transparent_1px)] "
            style={{
              opacity: 0.7,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
            }}
          
          ></div>
          
       
          {stars.map((star) => (
            <div 
              key={star.id}
              className="absolute rounded-full bg-amber-500 animate-float"
              style={{
                left: `${star.x}%`,
                top: `${star.y}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
                opacity: star.opacity,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 4px #fff, 0 0 8px #fef3c7'  
              }}
            />
          ))}
        </div>
      </div>

   
      <div className="mb-6 flex justify-center">
        <img 
          src="https://southindiagarmentsassociation.com/assets/images/events/gform.jpg" 
          alt="Header" 
          className="w-full max-w-2xl rounded-lg shadow-lg border-2 border-amber-200"
        />
      </div>

      <form onSubmit={onSubmit} noValidate>
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-amber-300 shadow-lg hover:shadow-amber-100/50 transition-shadow">
          <CardContent className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-800">Participant ID Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-800">
                    Firm Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter firm name"
                    name="id_name_of_firm"
                    value={participants.id_name_of_firm}
                    onChange={handleInputChange}
                    className="bg-white border-amber-300 focus:ring-amber-200 focus:border-amber-400"
                  />
                  {errors.id_name_of_firm && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_name_of_firm}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-800">
                    Brand Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter brand name"
                    name="id_card_brand_name"
                    value={participants.id_card_brand_name}
                    onChange={handleInputChange}
                    className="bg-white border-amber-300 focus:ring-amber-200 focus:border-amber-400"
                  />
                  {errors.id_card_brand_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_card_brand_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-800">
                    Firm Email <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter firm email"
                    name="id_firm_email"
                    value={participants.id_firm_email}
                    onChange={handleInputChange}
                    className="bg-white border-amber-300 focus:ring-amber-200 focus:border-amber-400"
                  />
                  {errors.id_firm_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_firm_email}</p>
                  )}
                </div>
              </div>
            </div>

          
         
<div className="sm:hidden">
  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-amber-800">Representatives</h2>
      <Button
        type="button"
        onClick={addRepresentative}
        size="sm"
        className="bg-amber-600 hover:bg-amber-700 text-white"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>

    <div className="space-y-3">
      {representatives.map((rep, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg border ${errors.representatives[index]?.idcardsub_rep_name || errors.representatives[index]?.idcardsub_rep_image ? 'border-red-500' : 'border-amber-200'} bg-white shadow-sm`}
        >
          <div className="flex justify-between items-center gap-2">
       
            <div className="flex-1 w-[80%]">
              <Input
                value={rep.idcardsub_rep_name}
                onChange={(e) => 
                  handleRepresentativeChange(index, "idcardsub_rep_name", e.target.value)
                }
                placeholder="Full Name"
                className={`w-full ${errors.representatives[index]?.idcardsub_rep_name ? 'border-red-500' : 'border-amber-300'}`}
              />
             
            </div>

       
            <div className="w-[20%] flex items-center gap-1">
              <label className="cursor-pointer">
                <div className={`p-1 rounded-md flex items-center justify-center ${errors.representatives[index]?.idcardsub_rep_image ? 'border border-red-500' : 'bg-amber-100 hover:bg-amber-200'}`}>
                  {rep.idcardsub_rep_image ? (
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  ) : (
                    <ImageUp className="h-7 w-7 text-amber-600" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                  className="hidden"
                />
              </label>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRepresentative(index)}
                disabled={representatives.length === 1}
                className="text-red-600 hover:bg-red-50/50 p-1 h-auto"
                type="button"
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          
          <div className=" flex flex-row items-center gap-1">
            {errors.representatives[index]?.idcardsub_rep_name && (
              <p className="text-xs text-red-600 animate-fade-in">
                {errors.representatives[index].idcardsub_rep_name}
              </p>
            )}
            {
              errors.representatives[index]?.idcardsub_rep_name && errors.representatives[index]?.idcardsub_rep_image &&(
                <span className="text-xs text-red-600 animate-fade-in">
                  &
                </span>
              )
            }
            {errors.representatives[index]?.idcardsub_rep_image && (
              <p className="text-xs text-red-600 animate-fade-in">
                {errors.representatives[index].idcardsub_rep_image}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
            <div className="hidden sm:block">

           
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-amber-800">Representatives</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-100/80">
                      <th className="p-3 text-left border border-amber-200 text-sm font-medium text-amber-800">
                         Name <span className="text-red-600">*</span>
                      </th>
                     
                      <th className="p-3 text-left border border-amber-200 text-sm font-medium text-amber-800">
                        Image <span className="text-red-600">*</span>
                      </th>
                      <th className="p-3 text-left border border-amber-200 text-amber-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {representatives.map((rep, index) => (
                      <tr key={index} className="border-b border-amber-200 hover:bg-amber-50/30 transition-colors">
                        <td className="p-3 border border-amber-200">
                          <Input
                            value={rep.idcardsub_rep_name}
                            onChange={(e) => 
                              handleRepresentativeChange(index, "idcardsub_rep_name", e.target.value)
                            }
                            placeholder="Enter name"
                            className="w-full border border-amber-300 bg-white focus:ring-amber-200 focus:border-amber-400"
                          />
                          {errors.representatives[index]?.idcardsub_rep_name && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.representatives[index].idcardsub_rep_name}
                            </p>
                          )}
                        </td>
                 
                        <td className="p-3 border border-amber-200">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(index, e)}
                            className="w-full border border-amber-300 bg-white file:bg-amber-50 file:text-amber-800 file:border-0 file:mr-2 file:px-3 file:py-1 file:text-sm file:rounded focus:ring-amber-200 focus:border-amber-400"
                          />
                          {rep.idcardsub_rep_image ? (
                            <span className="text-sm text-amber-600">File selected</span>
                          ) : errors.representatives[index]?.idcardsub_rep_image ? (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.representatives[index].idcardsub_rep_image}
                            </p>
                          ) : null}
                        </td>
                        <td className="p-3 border border-amber-200">
                          <Button
                            variant="ghost"
                            onClick={() => removeRepresentative(index)}
                            disabled={representatives.length === 1}
                            className="text-red-600 hover:bg-red-50/50"
                            type="button"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                onClick={addRepresentative}
                className="bg-amber-600 hover:bg-amber-700 text-white mt-4 hover:shadow-amber-200/50 transition-all"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Representative
              </Button>
            </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md hover:shadow-amber-200/50 transition-all"
            disabled={createIdCardMutation.isPending}
          >
            {createIdCardMutation.isPending ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>
      </form>

   
      <div className="mt-8 text-center text-sm text-amber-800/70">
        <div className="text-xs text-amber-800/50">
          Copyright © {new Date().getFullYear()} | Siga Fair
        </div>
      </div>

      
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;