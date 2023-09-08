import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";


function Manage() {
  const [recipes, setRecipes] = useState([]);
  const [recipeEdit, setRecipeEdit] = useState({});
  const [modalMode, setModalMode] = useState("add");
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipeModalOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleRecipeModalClose = () => {
    setSelectedRecipe(null);
    setShowRecipeModal(false);
  };

  // modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (mode = "add") => {
    setModalMode(mode);
    if (mode === "add") {
      setRecipeEdit({});
      // Resetting form values
      setValue("recipeName", "");
      setValue("ingredients", "");
      setValue("instructions", "");
      setValue("imageUrl", "");
      setValue("prepTime", "");
      setValue("cookTime", "");
      setValue("servings", "");
    }
    setShow(true);
  };

  //Use form
  let {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // to get all recipes
  const getRecipes = () => {
    axios
      .get("http://localhost:4000/APIs/RecipeApi")
      .then((res) => {
        setRecipes(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  // to add a recipe
  const addRecipe = () => {
    // closes modal
    handleClose();
    // gets values from form
    let newRecipe = getValues();
    // adds recipe to DB
    axios
      .post(`http://localhost:4000/APIs/RecipeApi`, newRecipe)
      .then((res) => {
        getRecipes();
      })
      .catch((err) => console.log(err));
  };

  // to edit a recipe
  const editModal = (recipeEdit) => {
    setRecipeEdit(recipeEdit);
    // shows modal
    handleShow();
    console.log(recipeEdit);
    // sets recipeEdit state
    setRecipeEdit(recipeEdit);
    // sets form values
    setValue("recipeName", recipeEdit.recipeName);
    setValue("ingredients", recipeEdit.ingredients);
    setValue("instructions", recipeEdit.instructions);
    setValue("imageUrl", recipeEdit.imageUrl);
    setValue("prepTime", recipeEdit.prepTime);
    setValue("cookTime", recipeEdit.cookTime);
    setValue("servings", recipeEdit.servings);
    handleShow("edit");
  };

  // to save an edied recipe
  const saveRecipe = () => {
    // closes modal
    handleClose();
    // gets values from form
    let modifiedRecipe = getValues();
    // sets id of modifiedRecipe to id of recipeEdit
    modifiedRecipe._id = recipeEdit._id;
    // modifies recipe in DB
    axios
      .put(
        `http://localhost:4000/APIs/RecipeApi/${modifiedRecipe._id}`,
        modifiedRecipe
      )
      .then((res) => {
        getRecipes();
      })
      .catch((err) => console.log(err));
  };

  // to delete a recipe
  const deleteRecipe = (id) => {
    // deletes recipe from DB
    axios
      .delete(`http://localhost:4000/APIs/RecipeApi/${id}`)
      .then((res) => {
        getRecipes();
      })
      .catch((err) => console.log(err));
  };

  // to delete all recipes
  const deleteAllRecipes = () => {
    // deletes all recipes from DB
    axios
      .delete(`http://localhost:4000/APIs/RecipeApi`)
      .then((res) => {
        getRecipes();
      })
      .catch((err) => console.log(err));
  };

  // network request
  useEffect(() => getRecipes(), [recipes.length]);

  useEffect(() => {
    if (show) {
      const textAreas = document.querySelectorAll(".auto-resize");
      textAreas.forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.scrollTop = textarea.scrollHeight;
      });
    }
  }, [show]);

  return (
    <div className="App">
      <div
        style={{
          padding: "5px 5px",
        }}
      >
        <h1 className="mt-2 ms-5 text-dark"><span style={{backgroundColor: "rgba(242, 242, 242, 0.8)"}}>My Recipe</span></h1>
      </div>
      <button
        className="btn btn-primary ms-5 mt-2"
        onClick={() => handleShow()}
      >
        Add Recipe
      </button>
      <button className="btn btn-danger ms-2 mt-2" onClick={deleteAllRecipes}>
        Delete All Recipes
      </button>
      <div className="row recipe-grid m-3">
        {Array.isArray(recipes) &&
          recipes.map((recipe, index) => (
            <div className="col-md-4 mb-4" key={recipe._id?.$oid || index}>
              <Card className="custom-card-shadow">
                <Card.Img
                  variant="top"
                  src={recipe.imageUrl}
                  alt={recipe.recipeName}
                />
                <Card.Body>
                  <Card.Title>{recipe.recipeName}</Card.Title>
                  <p>Prep Time:{recipe.prepTime}</p>
                  <p>Cook Time:{recipe.cookTime}</p>
                  <p>Serves:{recipe.servings}</p>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleRecipeModalOpen(recipe)}
                  >
                    View Recipe
                  </Button>
                  <Button
                    variant="primary ms-3"
                    onClick={() => editModal(recipe)}
                  >
                    Edit Recipe
                  </Button>
                  <Button
                    variant="danger ms-3"
                    onClick={() => deleteRecipe(recipe._id)}
                  >
                    Delete Recipe
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Recipe" : "Edit Recipe"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(
              modalMode === "add" ? addRecipe : saveRecipe
            )}
          >
            <div className="row">
              {/* Column 1 */}
              <div className="col-md-6">
                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Recipe Name</label>
                  <input
                    {...register("recipeName", { required: true })}
                    className="form-control"
                    placeholder="Enter recipe name"
                  />
                  {errors.recipeName && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>

                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Ingredients</label>
                  <textarea
                    {...register("ingredients", { required: true })}
                    className="form-control auto-resize"
                    placeholder="List down the ingredients"
                  />
                  {errors.ingredients && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>

                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Instructions</label>
                  <textarea
                    {...register("instructions", { required: true })}
                    className="form-control auto-resize"
                  />
                  {errors.instructions && <span>This field is required</span>}
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-md-6">
                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Prep Time</label>
                  <input
                    {...register("prepTime", { required: true })}
                    className="form-control"
                    placeholder="15 mins"
                  />
                  {errors.prepTime && (
                    <span className="text-danger">Required</span>
                  )}
                </div>

                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Cook Time</label>
                  <input
                    {...register("cookTime", { required: true })}
                    className="form-control"
                    placeholder="30 mins"
                  />
                  {errors.cookTime && <span>This field is required</span>}
                </div>

                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Servings</label>
                  <input
                    {...register("servings", { required: true })}
                    className="form-control"
                    placeholder="4 servings"
                  />
                  {errors.servings && <span>This field is required</span>}
                </div>

                <div className="form-group m-2">
                  <label className="mb-2 fw-bold">Image URL</label>
                  <input
                    {...register("imageUrl", { required: true })}
                    className="form-control"
                    placeholder="http://example.com/image.jpg"
                  />
                  {errors.imageUrl && <span>This field is required</span>}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={modalMode === "add" ? addRecipe : saveRecipe}
          >
            {modalMode === "add" ? "Add" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRecipeModal} onHide={handleRecipeModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.recipeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Prep Time:</strong> {selectedRecipe?.prepTime}
          </p>
          <p>
            <strong>Cook Time:</strong> {selectedRecipe?.cookTime}
          </p>
          <p>
            <strong>Servings:</strong> {selectedRecipe?.servings}
          </p>
          <h5>Ingredients:</h5>
          <p>{selectedRecipe?.ingredients}</p>
          <h5>Instructions:</h5>
          <p>{selectedRecipe?.instructions}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRecipeModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manage;
