<?php

namespace AppBundle\Form\Type;

use AppBundle\Entity\Question;
use FM\ElfinderBundle\Form\Type\ElFinderType;
use Ivory\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class QuestionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class)
            ->add('category', TextType::class, [
                'required' => false,
            ])
            ->add('text', CKEditorType::class, [
                'attr' => [
                    'rows' => 4,
                ],
            ])
            ->add('images', ElFinderType::class, [
                'instance' => 'form',
                'enable' => true,
                'required' => false,
            ]);

        $builder->get('images')
            ->addModelTransformer(new CallbackTransformer(
                function (array $values = null) {
                    // transform the array to a string
                    return \json_encode($values ?? []);
                },
                function (string $value = null) {
                    // transform the string back to an array
                    return \json_decode($value, true);
                }
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
           'data_class' => Question::class,
        ]);
    }

    public function getName()
    {
        return 'appbundle_question';
    }
}
